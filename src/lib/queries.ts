import { asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { inquiries, instructors, notifications, packages, sessions, gallery } from "@/db/schema";
import { ensureSeedData } from "@/lib/seed";

function asNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

export async function getWebsiteData() {
  await ensureSeedData();

  const [coachRows, packageRows, sessionRows, totalLeadRows, galleryRows] = await Promise.all([
    db.select().from(instructors).where(eq(instructors.isActive, true)).orderBy(desc(instructors.experienceYears)),
    db.select().from(packages).where(eq(packages.isActive, true)).orderBy(desc(packages.isPopular), asc(packages.price)),
    db.select({
      id: sessions.id,
      title: sessions.title,
      sessionType: sessions.sessionType,
      level: sessions.level,
      dayLabel: sessions.dayLabel,
      weekday: sessions.weekday,
      startTime: sessions.startTime,
      endTime: sessions.endTime,
      capacity: sessions.capacity,
      location: sessions.location,
      description: sessions.description,
      coachName: instructors.fullName,
      coachRole: instructors.role,
    })
      .from(sessions)
      .innerJoin(instructors, eq(sessions.instructorId, instructors.id))
      .where(eq(sessions.isActive, true))
      .orderBy(asc(sessions.weekday), asc(sessions.startTime)),
    db.select({ count: sql<number>`count(*)` }).from(inquiries),
    db.select().from(gallery).where(eq(gallery.isActive, true)).orderBy(asc(gallery.order), desc(gallery.createdAt)),
  ]);

  const totalLeads = asNumber(totalLeadRows[0]?.count);

  return {
    coaches: coachRows,
    packages: packageRows.map((item) => ({
      ...item,
      price: asNumber(item.price),
    })),
    sessions: sessionRows,
    gallery: galleryRows,
    stats: {
      weeklySessions: sessionRows.length,
      activeCoaches: coachRows.length,
      packages: packageRows.length,
      totalLeads,
    },
  };
}

export async function getDashboardData() {
  await ensureSeedData();

  const [
    totalInquiriesRow,
    weeklyInquiriesRow,
    packageCountRow,
    featuredSessionRow,
    notificationCountRow,
    avgPackagePriceRow,
    pendingInquiriesRow,
    recentInquiries,
    recentNotifications,
    schedule,
    allSessions,
    allPackages,
    allInstructors,
    allGallery,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(inquiries),
    db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries)
      .where(sql`${inquiries.createdAt} >= now() - interval '7 days'`),
    db.select({ count: sql<number>`count(*)` }).from(packages).where(eq(packages.isActive, true)),
    db.select({ count: sql<number>`count(*)` }).from(sessions).where(eq(sessions.isFeatured, true)),
    db.select({ count: sql<number>`count(*)` }).from(notifications),
    db.select({ value: sql<string>`coalesce(avg(${packages.price}), 0)` }).from(packages),
    db.select({ count: sql<number>`count(*)` }).from(inquiries).where(eq(inquiries.status, "new")),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(15),
    db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(10),
    db
      .select({
        id: sessions.id,
        title: sessions.title,
        dayLabel: sessions.dayLabel,
        startTime: sessions.startTime,
        endTime: sessions.endTime,
        location: sessions.location,
        capacity: sessions.capacity,
        coachName: instructors.fullName,
      })
      .from(sessions)
      .innerJoin(instructors, eq(sessions.instructorId, instructors.id))
      .where(eq(sessions.isActive, true))
      .orderBy(asc(sessions.weekday), asc(sessions.startTime)),
    db.select().from(sessions).orderBy(asc(sessions.weekday), asc(sessions.startTime)),
    db.select().from(packages).orderBy(asc(packages.id)),
    db.select().from(instructors).orderBy(asc(instructors.id)),
    db.select().from(gallery).orderBy(asc(gallery.order), desc(gallery.createdAt)),
  ]);

  return {
    stats: {
      totalInquiries: asNumber(totalInquiriesRow[0]?.count),
      weeklyInquiries: asNumber(weeklyInquiriesRow[0]?.count),
      activePackages: asNumber(packageCountRow[0]?.count),
      featuredSessions: asNumber(featuredSessionRow[0]?.count),
      notificationQueue: asNumber(notificationCountRow[0]?.count),
      averagePackagePrice: asNumber(avgPackagePriceRow[0]?.value),
      pendingInquiries: asNumber(pendingInquiriesRow[0]?.count),
    },
    recentInquiries,
    recentNotifications,
    schedule,
    allSessions,
    allPackages,
    allInstructors,
    allGallery,
  };
}

export async function getDashboardApiPayload() {
  const data = await getDashboardData();

  return {
    ...data,
    recentInquiries: data.recentInquiries.map((item) => ({
      ...item,
      createdAt: item.createdAt?.toISOString() ?? null,
    })),
    recentNotifications: data.recentNotifications.map((item) => ({
      ...item,
      createdAt: item.createdAt?.toISOString() ?? null,
    })),
  };
}
