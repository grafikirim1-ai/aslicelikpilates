import { eq, sql } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";

import { db } from "@/db";
import { inquiries, instructors, notifications, packages, sessions, gallery, members } from "@/db/schema";

async function countRows(table: AnyPgTable) {
  const result = await db.select({ count: sql<number>`count(*)` }).from(table);
  return Number(result[0]?.count ?? 0);
}

export async function ensureSeedData() {
  // Ensure DB columns exist for instructorId and status in acp_members
  try {
    await db.execute(sql`
      ALTER TABLE acp_members ADD COLUMN IF NOT EXISTS instructor_id integer REFERENCES acp_instructors(id) ON DELETE SET NULL;
      ALTER TABLE acp_members ADD COLUMN IF NOT EXISTS status varchar(40) NOT NULL DEFAULT 'active';
      ALTER TABLE acp_sessions ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false;
      ALTER TABLE acp_sessions ADD COLUMN IF NOT EXISTS member_id integer;
      ALTER TABLE acp_sessions ADD COLUMN IF NOT EXISTS member_name varchar(120);
    `);
  } catch (err) {
    console.error("DB Column migration check error:", err);
  }

  const galleryCount = await countRows(gallery);
  if (galleryCount === 0) {
    await db.insert(gallery).values([
      {
        title: "Aslı Çelik Reformer Çalışması",
        category: "Eğitmen & Seans",
        imageUrl: "/asli-celik-reformer.jpg",
        description: "Reformer pilates ekipmanı üzerinde kişiye özel postür ve denge çalışması.",
        order: 1,
      },
      {
        title: "Ladder Barrel Esneklik Akışı",
        category: "Eğitmen & Seans",
        imageUrl: "/asli-celik-stretch.jpg",
        description: "Omurga sağlığı ve derin esneklik sağlayan özel ekipman seansı.",
        order: 2,
      },
      {
        title: "Stüdyo Aynası & Hazırlık",
        category: "Stüdyomuz",
        imageUrl: "/asli-celik-studio.jpg",
        description: "Butik stüdyomuzda seans öncesi kişisel değerlendirme ve hazırlık.",
        order: 3,
      },
      {
        title: "Resepsiyon & Karşılama Alanı",
        category: "Stüdyomuz",
        imageUrl: "/studio-reception.jpg",
        description: "Dinlenme, karşılama ve ücretsiz ön görüşme alanı.",
        order: 4,
      },
      {
        title: "Reformer Grup & Birebir Salonu",
        category: "Stüdyomuz",
        imageUrl: "/studio-reformers.jpg",
        description: "Geniş kemerli aynalar ve modern ahşap reformer cihazlarımız.",
        order: 5,
      },
    ]);
  }
  // Ensure active instructors match exact team requested by user
  const newInstructors = [
    {
      fullName: "Aslı Çelik",
      role: "Kurucu Eğitmen, Master Pilates Koçu",
      specialties: ["Reformer Pilates", "Postür Düzeltme"],
      bio: "Kurucu Eğitmen ve Master Pilates Koçu olarak kişiye özel reformer ve omurga sağlığı seanslarını yönetmektedir.",
      phone: "0543 219 42 20",
      email: "asli@aslicelikpilates.com",
      experienceYears: 12,
    },
    {
      fullName: "Fulya Aydoğdu",
      role: "Pilates Koçu",
      specialties: ["Reformer Pilates", "Mat Pilates"],
      bio: "Reformer ve Mat Pilates alanında uzman, hareket kalitesi ve kas aktivasyonuna odaklı pilates koçu.",
      phone: "0543 219 42 20",
      email: "fulya@aslicelikpilates.com",
      experienceYears: 6,
    },
    {
      fullName: "Özge Türkarslan",
      role: "Fizyoterapist, Pilates Koçu",
      specialties: ["Postür Düzeltme", "Core Güçlendirme"],
      bio: "Fizyoterapi altyapısıyla postür analizi, omurga hizalaması ve klinik odaklı pilates programları yürütmektedir.",
      phone: "0543 219 42 20",
      email: "ozge@aslicelikpilates.com",
      experienceYears: 5,
    },
    {
      fullName: "Furkan Acaroğlu",
      role: "Fizyoterapist, Pilates Koçu",
      specialties: ["Postür Düzeltme", "Core Güçlendirme"],
      bio: "Fizyoterapist eşliğinde omurga sağlığı, duruş bozuklukları ve fonksiyonel core güçlendirme çalışmaları sunmaktadır.",
      phone: "0543 219 42 20",
      email: "furkan@aslicelikpilates.com",
      experienceYears: 5,
    },
  ];

  const existingInstructors = await db.select().from(instructors);
  if (existingInstructors.length === 0) {
    await db.insert(instructors).values(newInstructors);
  } else {
    for (const newInst of newInstructors) {
      try {
        const match = existingInstructors.find(
          (inst) => inst.email === newInst.email || inst.fullName === newInst.fullName
        );
        if (match) {
          await db
            .update(instructors)
            .set({
              fullName: newInst.fullName,
              role: newInst.role,
              specialties: newInst.specialties,
              bio: newInst.bio,
              phone: newInst.phone,
              experienceYears: newInst.experienceYears,
            })
            .where(eq(instructors.id, match.id));
        } else {
          await db.insert(instructors).values(newInst);
        }
      } catch (e) {
        console.warn("Seed warning for instructor:", newInst.fullName);
      }
    }
  }

  const packageCount = await countRows(packages);

  if (packageCount === 0) {
    await db.insert(packages).values([
      {
        slug: "bireysel-8",
        name: "Bireysel 8 Seans",
        description: "Birebir kişiye özel antrenör eşliğinde Reformer, Cadillac, Chair ve Spine Corrector dersleri.",
        sessionsCount: 8,
        durationDays: 30,
        price: "8000.00",
        focus: "Bireysel Özel Ders",
        includes: ["Kişiye özel postür analizi", "8 birebir seans", "Cadillac, Chair & Barrel kullanımı"],
        isPopular: false,
      },
      {
        slug: "bireysel-16",
        name: "Bireysel 16 Seans",
        description: "Derinlemesine duruş düzeltme, güçlenme ve yüksek performans sağlanan uzun dönemli özel paket.",
        sessionsCount: 16,
        durationDays: 60,
        price: "15000.00",
        focus: "Tam Dönüşüm Seti",
        includes: ["16 birebir ders", "Öncelikli ders saatleri", "Düzenli gelişim takibi"],
        isPopular: true,
      },
      {
        slug: "duet-8",
        name: "2 Kişilik 8 Seans (Düet)",
        description: "Arkadaşınız veya eşinizle birlikte katılabileceğiniz 2 kişilik butik reformer seansları.",
        sessionsCount: 8,
        durationDays: 30,
        price: "5500.00",
        focus: "2 Kişilik Butik Ders",
        includes: ["8 düet reformer seansı", "2 kişilik özel grup salonu", "Eğitmen takibi"],
        isPopular: false,
      },
      {
        slug: "duet-16",
        name: "2 Kişilik 16 Seans (Düet)",
        description: "Düzenli katılım sağlayan 2 kişilik gruplar için en avantajlı uzun dönem düet paketi.",
        sessionsCount: 16,
        durationDays: 60,
        price: "10000.00",
        focus: "Düet Avantaj Seti",
        includes: ["16 düet seans", "Esnek seans saatleri", "Gelişim ölçümü"],
        isPopular: false,
      },
      {
        slug: "trio-8",
        name: "3 Kişilik 8 Seans (Trio)",
        description: "3 kişilik küçük ve samimi gruplarla motivasyonu yüksek grup reformer pilates seansları.",
        sessionsCount: 8,
        durationDays: 30,
        price: "4750.00",
        focus: "3 Kişilik Grup",
        includes: ["8 grup reformer dersi", "3 kişilik mini sınıf", "Düzenli program"],
        isPopular: false,
      },
      {
        slug: "grup-4-8",
        name: "4 Kişilik 8 Seans",
        description: "4 kişilik butik sınıflarda esneklik, güçlenme ve omurga sağlığı akışları.",
        sessionsCount: 8,
        durationDays: 30,
        price: "4200.00",
        focus: "4 Kişilik Butik Grup",
        includes: ["8 grup reformer seansı", "Max 4 kişilik sınıf", "Postür iyileştirme"],
        isPopular: false,
      },
      {
        slug: "grup-5-8",
        name: "5 Kişilik 8 Seans",
        description: "5 kişilik gruplarda enerjik ve yüksek motivasyonlu grup reformer pilates deneyimi.",
        sessionsCount: 8,
        durationDays: 30,
        price: "3700.00",
        focus: "5 Kişilik Grup Dersi",
        includes: ["8 grup seansı", "Max 5 kişilik sınıf", "Bütçe dostu paket"],
        isPopular: false,
      },
    ]);
  }

  const sessionCount = await countRows(sessions);

  if (sessionCount === 0) {
    const coachRows = await db.select().from(instructors);
    const coachMap = new Map(coachRows.map((coach) => [coach.email, coach.id]));

    await db.insert(sessions).values([
      {
        slug: "pazartesi-sabah-reformer",
        title: "Sabah Reformer Flow",
        sessionType: "Reformer Pilates",
        level: "Başlangıç - Orta",
        dayLabel: "Pazartesi",
        weekday: 1,
        startTime: "09:00",
        endTime: "09:50",
        durationMinutes: 50,
        capacity: 6,
        location: "Bağlıca Stüdyo",
        description: "Haftaya omurgayı uyandıran, nefes ve merkez kaslarını aktive eden yumuşak başlangıç dersi.",
        instructorId: coachMap.get("asli@aslicelikpilates.com") ?? coachRows[0].id,
        isFeatured: true,
      },
      {
        slug: "sali-aksam-core",
        title: "Core Balance",
        sessionType: "Mat Pilates",
        level: "Orta",
        dayLabel: "Salı",
        weekday: 2,
        startTime: "19:00",
        endTime: "19:50",
        durationMinutes: 50,
        capacity: 8,
        location: "Bağlıca Stüdyo",
        description: "Karın, bel ve kalça hattını güçlendirirken denge hissini kuvvetlendiren akşam akışı.",
        instructorId: coachMap.get("mina@aslicelikpilates.com") ?? coachRows[1]?.id ?? coachRows[0].id,
        isFeatured: true,
      },
      {
        slug: "carsamba-hamile-pilatesi",
        title: "Prenatal Ease",
        sessionType: "Hamile Pilatesi",
        level: "Güvenli Başlangıç",
        dayLabel: "Çarşamba",
        weekday: 3,
        startTime: "13:00",
        endTime: "13:50",
        durationMinutes: 50,
        capacity: 5,
        location: "Özel Ders Salonu",
        description: "Hamilelik sürecinde nefes, mobilite ve güvenli güçlenmeye odaklanan destekleyici seans.",
        instructorId: coachMap.get("mina@aslicelikpilates.com") ?? coachRows[1]?.id ?? coachRows[0].id,
        isFeatured: false,
      },
      {
        slug: "persembe-aksam-reformer",
        title: "Evening Tone",
        sessionType: "Reformer Pilates",
        level: "Başlangıç",
        dayLabel: "Perşembe",
        weekday: 4,
        startTime: "18:30",
        endTime: "19:20",
        durationMinutes: 50,
        capacity: 6,
        location: "Bağlıca Stüdyo",
        description: "Uzun günlerin ardından bedeni toparlayan, eklem dostu akşam reformer pratiği.",
        instructorId: coachMap.get("selin@aslicelikpilates.com") ?? coachRows[2]?.id ?? coachRows[0].id,
        isFeatured: true,
      },
      {
        slug: "cumartesi-booty-core",
        title: "Weekend Sculpt",
        sessionType: "Fonksiyonel Pilates",
        level: "Orta - İleri",
        dayLabel: "Cumartesi",
        weekday: 6,
        startTime: "11:00",
        endTime: "11:50",
        durationMinutes: 50,
        capacity: 8,
        location: "Bağlıca Stüdyo",
        description: "Hafta sonunu enerjiyle açan, kuvvet ve akış birleşimli dinamik grup dersi.",
        instructorId: coachMap.get("asli@aslicelikpilates.com") ?? coachRows[0].id,
        isFeatured: true,
      },
    ]);
  }

  const inquiryCount = await countRows(inquiries);

  if (inquiryCount === 0) {
    const inserted = await db
      .insert(inquiries)
      .values([
        {
          fullName: "Elif Kaya",
          phone: "+90 532 111 22 33",
          email: "elif@example.com",
          goal: "Bel ağrısını azaltmak ve düzenli egzersiz rutini oluşturmak",
          preferredPackage: "Denge 8'li Paket",
          wantsWhatsapp: true,
          message: "Ofis temposundan dolayı akşam saatlerinde uygun grup dersleri arıyorum.",
          status: "contacted",
        },
        {
          fullName: "Zeynep Aydın",
          phone: "+90 533 444 55 66",
          email: "zeynep@example.com",
          goal: "Hamilelik döneminde güvenli hareket programı",
          preferredPackage: "Tanışma Paketi",
          wantsWhatsapp: true,
          message: "Doktor onayıyla haftada iki gün destek almak istiyorum.",
          status: "new",
        },
      ])
      .returning({ id: inquiries.id, fullName: inquiries.fullName, phone: inquiries.phone, email: inquiries.email });

    await db.insert(notifications).values([
      {
        channel: "whatsapp",
        recipient: inserted[0]?.phone ?? "+90 532 111 22 33",
        title: "Tanışma mesajı",
        message: "Merhaba Elif, sizin için uygun akşam seanslarını paylaştık.",
        eventType: "lead-follow-up",
        status: "demo-sent",
        relatedInquiryId: inserted[0]?.id,
      },
      {
        channel: "email",
        recipient: inserted[1]?.email ?? "zeynep@example.com",
        title: "Hamile pilatesi bilgilendirmesi",
        message: "Prenatal seans akışımız ve değerlendirme sürecimiz e-posta ile iletildi.",
        eventType: "lead-follow-up",
        status: "demo-sent",
        relatedInquiryId: inserted[1]?.id,
      },
      {
        channel: "dashboard",
        recipient: "stüdyo paneli",
        title: "Yeni lead kaydı",
        message: "Web formundan gelen ziyaretçiler yönetim paneline işlendi.",
        eventType: "internal-alert",
        status: "logged",
      },
    ]);
  }

  const memberCount = await countRows(members);
  if (memberCount === 0) {
    const coachRows = await db.select().from(instructors);
    if (coachRows.length > 0) {
      await db.insert(members).values([
        {
          fullName: "Selin Yılmaz",
          phone: "0532 111 22 33",
          email: "selin@example.com",
          packageName: "Bireysel 8 Seans",
          totalSessions: 8,
          remainingSessions: 5,
          totalPrice: "8000.00",
          paidAmount: "8000.00",
          paymentStatus: "paid",
          paymentMethod: "Kredi Kartı",
          instructorId: coachRows[0]?.id,
          status: "active",
          notes: "Bel fıtığı hassasiyeti var, reformer direnci 1. seviyede tutulmalı.",
        },
        {
          fullName: "Merve Demir",
          phone: "0533 222 33 44",
          email: "merve@example.com",
          packageName: "Bireysel 16 Seans",
          totalSessions: 16,
          remainingSessions: 12,
          totalPrice: "15000.00",
          paidAmount: "15000.00",
          paymentStatus: "paid",
          paymentMethod: "EFT / Havale",
          instructorId: coachRows[1]?.id || coachRows[0]?.id,
          status: "active",
          notes: "Postür düzeltme ve omuz mobilizasyonuna odaklanılıyor.",
        },
        {
          fullName: "Deniz Kara",
          phone: "0535 333 44 55",
          email: "deniz@example.com",
          packageName: "2 Kişilik 8 Seans (Düet)",
          totalSessions: 8,
          remainingSessions: 7,
          totalPrice: "5500.00",
          paidAmount: "5500.00",
          paymentStatus: "paid",
          paymentMethod: "Kredi Kartı",
          instructorId: coachRows[2]?.id || coachRows[0]?.id,
          status: "active",
          notes: "Fizyoterapi desteğiyle skolyoz takibi yapılıyor.",
        },
        {
          fullName: "Ayşe Çelik",
          phone: "0536 444 55 66",
          email: "ayse@example.com",
          packageName: "Bireysel 8 Seans",
          totalSessions: 8,
          remainingSessions: 8,
          totalPrice: "8000.00",
          paidAmount: "0.00",
          paymentStatus: "pending",
          paymentMethod: "Nakit",
          instructorId: null,
          status: "pending",
          notes: "Web sitesinden yeni üyelik başvurusu yaptı. Yönetici onayı bekliyor.",
        },
      ]);
    }
  }
}
