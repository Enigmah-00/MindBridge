import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for seeding

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

      const doctor = await prisma.doctor.upsert({
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
        },
      });

      // Create the many-to-many relationships
      for (const specialty of doc.specialties) {
        await prisma.doctorSpecialty.upsert({
          where: {
            doctorId_specialtyId: {
              doctorId: doctor.id,
              specialtyId: specialty.id,
            },
          },
          update: {},
          create: {
            doctorId: doctor.id,
            specialtyId: specialty.id,
          },
        });
      }
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

    // SPIN Questions (Social Phobia Inventory)
    const spinQuestions = [
      "I am afraid of people in authority",
      "I am bothered by blushing in front of people",
      "Parties and social events scare me",
      "I avoid talking to people I don't know",
      "Being criticized scares me a lot",
      "I avoid doing things or speaking to people for fear of embarrassment",
      "Sweating in front of people causes me distress",
      "I avoid going to parties",
      "I avoid activities in which I am the center of attention",
      "Talking to strangers scares me",
      "I avoid having to give speeches",
      "I would do anything to avoid being criticized",
      "Heart palpitations bother me when I am around people",
      "I am afraid of doing things when people might be watching",
      "Being embarrassed or looking stupid are among my worst fears",
      "I avoid speaking to anyone in authority",
      "Trembling or shaking in front of others is distressing to me",
    ];

    for (const [i, text] of spinQuestions.entries()) {
      const existingQ = await prisma.question.findFirst({
        where: { quizId: spin.id, order: i + 1 }
      });

      if (!existingQ) {
        const q = await prisma.question.create({
          data: { quizId: spin.id, order: i + 1, text },
        });
        await prisma.option.createMany({
          data: [
            { questionId: q.id, label: "Not at all", value: 0 },
            { questionId: q.id, label: "A little bit", value: 1 },
            { questionId: q.id, label: "Somewhat", value: 2 },
            { questionId: q.id, label: "Very much", value: 3 },
            { questionId: q.id, label: "Extremely", value: 4 },
          ],
          skipDuplicates: true,
        });
      }
    }

    // PDSS Questions (Panic Disorder Severity Scale)
    const pdssQuestions = [
      "How many panic and limited symptom attacks did you have during the week?",
      "If you had any panic attacks, how distressing were they?",
      "During the past week, how much have you worried or felt anxious about when your next panic attack would occur?",
      "During the past week, were there any places or situations you avoided?",
      "During the past week, were there any activities you avoided?",
      "During the past week, how much did the above symptoms interfere with your ability to work?",
      "During the past week, how much did the symptoms interfere with your social life?",
    ];

    for (const [i, text] of pdssQuestions.entries()) {
      const existingQ = await prisma.question.findFirst({
        where: { quizId: pdss.id, order: i + 1 }
      });

      if (!existingQ) {
        const q = await prisma.question.create({
          data: { quizId: pdss.id, order: i + 1, text },
        });
        await prisma.option.createMany({
          data: [
            { questionId: q.id, label: "None", value: 0 },
            { questionId: q.id, label: "Mild", value: 1 },
            { questionId: q.id, label: "Moderate", value: 2 },
            { questionId: q.id, label: "Severe", value: 3 },
            { questionId: q.id, label: "Extreme", value: 4 },
          ],
          skipDuplicates: true,
        });
      }
    }

    // ASRS Questions (Adult ADHD Self-Report Scale - Part A)
    const asrsQuestions = [
      "How often do you have trouble wrapping up the final details of a project?",
      "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
      "How often do you have problems remembering appointments or obligations?",
      "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
      "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
      "How often do you feel overly active and compelled to do things?",
    ];

    for (const [i, text] of asrsQuestions.entries()) {
      const existingQ = await prisma.question.findFirst({
        where: { quizId: asrs.id, order: i + 1 }
      });

      if (!existingQ) {
        const q = await prisma.question.create({
          data: { quizId: asrs.id, order: i + 1, text },
        });
        await prisma.option.createMany({
          data: [
            { questionId: q.id, label: "Never", value: 0 },
            { questionId: q.id, label: "Rarely", value: 1 },
            { questionId: q.id, label: "Sometimes", value: 2 },
            { questionId: q.id, label: "Often", value: 3 },
            { questionId: q.id, label: "Very Often", value: 4 },
          ],
          skipDuplicates: true,
        });
      }
    }

    // OCI-R Questions (Obsessive-Compulsive Inventory-Revised)
    const ociQuestions = [
      "I have saved up so many things that they get in the way",
      "I check things more often than necessary",
      "I get upset if objects are not arranged properly",
      "I feel compelled to count while I am doing things",
      "I find it difficult to touch an object when I know it has been touched by strangers",
      "I find it difficult to control my own thoughts",
      "I collect things I don't need",
      "I repeatedly check doors, windows, drawers, etc.",
      "I get upset if others change the way I have arranged things",
      "I feel I have to repeat certain numbers",
      "I sometimes have to wash or clean myself simply because I feel contaminated",
      "I am upset by unpleasant thoughts that come into my mind against my will",
      "I avoid throwing things away because I am afraid I might need them later",
      "I repeatedly check gas and water taps and light switches after turning them off",
      "I need things to be arranged in a particular order",
      "I feel that there are good and bad numbers",
      "I wash my hands more often and longer than necessary",
      "I frequently get nasty thoughts and have difficulty getting rid of them",
    ];

    for (const [i, text] of ociQuestions.entries()) {
      const existingQ = await prisma.question.findFirst({
        where: { quizId: oci.id, order: i + 1 }
      });

      if (!existingQ) {
        const q = await prisma.question.create({
          data: { quizId: oci.id, order: i + 1, text },
        });
        await prisma.option.createMany({
          data: [
            { questionId: q.id, label: "Not at all", value: 0 },
            { questionId: q.id, label: "A little", value: 1 },
            { questionId: q.id, label: "Moderately", value: 2 },
            { questionId: q.id, label: "A lot", value: 3 },
            { questionId: q.id, label: "Extremely", value: 4 },
          ],
          skipDuplicates: true,
        });
      }
    }

    // PCL-5 Questions (PTSD Checklist)
    const pcl5Questions = [
      "Repeated, disturbing, and unwanted memories of the stressful experience?",
      "Repeated, disturbing dreams of the stressful experience?",
      "Suddenly feeling or acting as if the stressful experience were actually happening again?",
      "Feeling very upset when something reminded you of the stressful experience?",
      "Having strong physical reactions when something reminded you of the stressful experience?",
      "Avoiding memories, thoughts, or feelings related to the stressful experience?",
      "Avoiding external reminders of the stressful experience?",
      "Trouble remembering important parts of the stressful experience?",
      "Having strong negative beliefs about yourself, other people, or the world?",
      "Blaming yourself or someone else for the stressful experience or what happened after it?",
      "Having strong negative feelings such as fear, horror, anger, guilt, or shame?",
      "Loss of interest in activities that you used to enjoy?",
      "Feeling distant or cut off from other people?",
      "Trouble experiencing positive feelings?",
      "Irritable behavior, angry outbursts, or acting aggressively?",
      "Taking too many risks or doing things that could cause you harm?",
      "Being 'superalert' or watchful or on guard?",
      "Feeling jumpy or easily startled?",
      "Having difficulty concentrating?",
      "Trouble falling or staying asleep?",
    ];

    for (const [i, text] of pcl5Questions.entries()) {
      const existingQ = await prisma.question.findFirst({
        where: { quizId: pcl5.id, order: i + 1 }
      });

      if (!existingQ) {
        const q = await prisma.question.create({
          data: { quizId: pcl5.id, order: i + 1, text },
        });
        await prisma.option.createMany({
          data: [
            { questionId: q.id, label: "Not at all", value: 0 },
            { questionId: q.id, label: "A little bit", value: 1 },
            { questionId: q.id, label: "Moderately", value: 2 },
            { questionId: q.id, label: "Quite a bit", value: 3 },
            { questionId: q.id, label: "Extremely", value: 4 },
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
