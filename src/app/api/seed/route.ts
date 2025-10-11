import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// This endpoint should be protected in production
// Add authentication or disable after first use
export async function POST(req: NextRequest) {
  try {
    // Check if data already exists
    const existingDoctors = await prisma.doctor.count();
    const existingQuizzes = await prisma.quiz.count();
    
    if (existingDoctors > 0 && existingQuizzes > 0) {
      return NextResponse.json({ 
        message: 'Database already seeded',
        doctors: existingDoctors,
        quizzes: existingQuizzes
      });
    }

    // Specialties
    const [psychiatry, therapy, sleep] = await Promise.all([
      prisma.specialty.upsert({
        where: { key: "psychiatry" },
        update: {},
        create: { key: "psychiatry", name: "Psychiatry" },
      }),
      prisma.specialty.upsert({
        where: { key: "therapy-cbt" },
        update: {},
        create: { key: "therapy-cbt", name: "Therapy (CBT)" },
      }),
      prisma.specialty.upsert({
        where: { key: "sleep-medicine" },
        update: {},
        create: { key: "sleep-medicine", name: "Sleep Medicine" },
      }),
    ]);

    // Real doctors from Bangladesh
    const realDoctors = [
      {
        username: "dr_zaman",
        email: "drzaman@example.com",
        name: "Dr. Mohammad Zaman",
        city: "Dhaka",
        country: "Bangladesh",
        latitude: 23.7808875,
        longitude: 90.4009246,
        telehealth: true,
        specialties: [psychiatry, therapy],
      },
      {
        username: "dr_ahmed",
        email: "drahmed@example.com",
        name: "Dr. Farhana Ahmed",
        city: "Chittagong",
        country: "Bangladesh",
        latitude: 22.356851,
        longitude: 91.783182,
        telehealth: true,
        specialties: [psychiatry],
      },
      {
        username: "dr_hossain",
        email: "drhossain@example.com",
        name: "Dr. Kamal Hossain",
        city: "Dhaka",
        country: "Bangladesh",
        latitude: 23.7644025,
        longitude: 90.3897459,
        telehealth: false,
        specialties: [therapy],
      },
      {
        username: "dr_sultana",
        email: "drsultana@example.com",
        name: "Dr. Nasrin Sultana",
        city: "Sylhet",
        country: "Bangladesh",
        latitude: 24.8949,
        longitude: 91.8687,
        telehealth: true,
        specialties: [psychiatry, sleep],
      },
      {
        username: "dr_rahman",
        email: "drrahman@example.com",
        name: "Dr. Abdul Rahman",
        city: "Dhaka",
        country: "Bangladesh",
        latitude: 23.7515,
        longitude: 90.3769,
        telehealth: true,
        specialties: [therapy],
      },
    ];

    const password = await bcrypt.hash("doctor123", 10);

    for (const doc of realDoctors) {
      const user = await prisma.user.upsert({
        where: { username: doc.username },
        update: {},
        create: {
          username: doc.username,
          email: doc.email,
          passwordHash: password,
          role: "DOCTOR",
        },
      });

      await prisma.doctor.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          name: doc.name,
          city: doc.city,
          country: doc.country,
          latitude: doc.latitude,
          longitude: doc.longitude,
          telehealth: doc.telehealth,
          specialties: {
            connect: doc.specialties.map((s) => ({ id: s.id })),
          },
        },
      });
    }

    // Quizzes
    const phq = await prisma.quiz.upsert({
      where: { key: "PHQ-9" },
      update: {},
      create: {
        key: "PHQ-9",
        title: "PHQ-9 Depression Questionnaire",
        description: "Screening for depression severity",
      },
    });

    const gad = await prisma.quiz.upsert({
      where: { key: "GAD-7" },
      update: {},
      create: {
        key: "GAD-7",
        title: "GAD-7 Anxiety Questionnaire",
        description: "Screening for generalized anxiety",
      },
    });

    const pss = await prisma.quiz.upsert({
      where: { key: "PSS-10" },
      update: {},
      create: {
        key: "PSS-10",
        title: "Perceived Stress Scale",
        description: "Measure your stress levels",
      },
    });

    const spin = await prisma.quiz.upsert({
      where: { key: "SPIN" },
      update: {},
      create: {
        key: "SPIN",
        title: "Social Phobia Inventory",
        description: "Screen for social anxiety disorder",
      },
    });

    const pdss = await prisma.quiz.upsert({
      where: { key: "PDSS" },
      update: {},
      create: {
        key: "PDSS",
        title: "Panic Disorder Severity Scale",
        description: "Assess panic disorder symptoms",
      },
    });

    const asrs = await prisma.quiz.upsert({
      where: { key: "ASRS" },
      update: {},
      create: {
        key: "ASRS",
        title: "Adult ADHD Self-Report Scale",
        description: "Screen for ADHD in adults",
      },
    });

    const oci = await prisma.quiz.upsert({
      where: { key: "OCI-R" },
      update: {},
      create: {
        key: "OCI-R",
        title: "Obsessive-Compulsive Inventory",
        description: "Screen for OCD symptoms",
      },
    });

    const pcl5 = await prisma.quiz.upsert({
      where: { key: "PCL-5" },
      update: {},
      create: {
        key: "PCL-5",
        title: "PTSD Checklist",
        description: "Screen for PTSD symptoms",
      },
    });

    // PHQ-9 Questions
    const phqQuestions = [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself",
      "Trouble concentrating",
      "Moving/speaking slowly or being fidgety/restless",
      "Thoughts that you would be better off dead or of hurting yourself",
    ];

    for (const [i, text] of phqQuestions.entries()) {
      const existingQ = await prisma.question.findFirst({
        where: { quizId: phq.id, order: i + 1 }
      });

      if (!existingQ) {
        const q = await prisma.question.create({
          data: { quizId: phq.id, order: i + 1, text },
        });
        await prisma.option.createMany({
          data: [
            { questionId: q.id, label: "Not at all", value: 0 },
            { questionId: q.id, label: "Several days", value: 1 },
            { questionId: q.id, label: "More than half the days", value: 2 },
            { questionId: q.id, label: "Nearly every day", value: 3 },
          ],
          skipDuplicates: true,
        });
      }
    }

    // GAD-7 Questions
    const gadQuestions = [
      "Feeling nervous, anxious or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen",
    ];

    for (const [i, text] of gadQuestions.entries()) {
      const existingQ = await prisma.question.findFirst({
        where: { quizId: gad.id, order: i + 1 }
      });

      if (!existingQ) {
        const q = await prisma.question.create({
          data: { quizId: gad.id, order: i + 1, text },
        });
        await prisma.option.createMany({
          data: [
            { questionId: q.id, label: "Not at all", value: 0 },
            { questionId: q.id, label: "Several days", value: 1 },
            { questionId: q.id, label: "More than half the days", value: 2 },
            { questionId: q.id, label: "Nearly every day", value: 3 },
          ],
          skipDuplicates: true,
        });
      }
    }

    // PSS-10 Questions
    const pssQuestions = [
      "How often have you been upset because of something that happened unexpectedly?",
      "How often have you felt that you were unable to control important things in your life?",
      "How often have you felt nervous and stressed?",
      "How often have you felt confident about your ability to handle your personal problems?",
      "How often have you felt that things were going your way?",
      "How often have you found that you could not cope with all the things you had to do?",
      "How often have you been able to control irritations in your life?",
      "How often have you felt that you were on top of things?",
      "How often have you been angered because of things outside of your control?",
      "How often have you felt difficulties were piling up so high that you could not overcome them?",
    ];

    for (const [i, text] of pssQuestions.entries()) {
      const existingQ = await prisma.question.findFirst({
        where: { quizId: pss.id, order: i + 1 }
      });

      if (!existingQ) {
        const q = await prisma.question.create({
          data: { quizId: pss.id, order: i + 1, text },
        });
        await prisma.option.createMany({
          data: [
            { questionId: q.id, label: "Never", value: 0 },
            { questionId: q.id, label: "Almost never", value: 1 },
            { questionId: q.id, label: "Sometimes", value: 2 },
            { questionId: q.id, label: "Fairly often", value: 3 },
            { questionId: q.id, label: "Very often", value: 4 },
          ],
          skipDuplicates: true,
        });
      }
    }

    const finalDoctors = await prisma.doctor.count();
    const finalQuizzes = await prisma.quiz.count();
    const finalQuestions = await prisma.question.count();

    return NextResponse.json({ 
      success: true,
      message: 'Database seeded successfully',
      data: {
        doctors: finalDoctors,
        quizzes: finalQuizzes,
        questions: finalQuestions
      }
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check seed status
export async function GET() {
  try {
    const doctors = await prisma.doctor.count();
    const quizzes = await prisma.quiz.count();
    const questions = await prisma.question.count();
    const specialties = await prisma.specialty.count();

    return NextResponse.json({
      seeded: doctors > 0 && quizzes > 0,
      counts: {
        doctors,
        quizzes,
        questions,
        specialties
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check seed status', details: error.message },
      { status: 500 }
    );
  }
}
