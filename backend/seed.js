const mongoose = require('mongoose');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Article = require('./models/Article');
const Quiz = require('./models/Quiz');
const QuizAttempt = require('./models/QuizAttempt');
const Notification = require('./models/Notification');

async function seedDatabase() {
  console.log('🌱 Seeding shared MongoDB Atlas database with Lumen CMS initial data...\n');

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected to Atlas: ${conn.connection.host}/${conn.connection.name}`);

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Article.deleteMany({}),
      Quiz.deleteMany({}),
      QuizAttempt.deleteMany({}),
      Notification.deleteMany({})
    ]);

    // 1. Create Core Users (Admin, Author, Reader)
    const admin = await User.create({
      name: 'Nikhitha Admin',
      email: 'admin@lumen.test',
      password: 'adminpassword123',
      role: 'Admin',
      bio: 'Platform Administrator and Reviewer'
    });

    const author = await User.create({
      name: 'Syed Zaid (Author)',
      email: 'author@lumen.test',
      password: 'authorpassword123',
      role: 'Author',
      bio: 'Tech enthusiast and technical writer on Lumen.'
    });

    const reader = await User.create({
      name: 'Lena Kaufmann (Reader)',
      email: 'reader@lumen.test',
      password: 'readerpassword123',
      role: 'Reader',
      bio: 'Curious reader and tech learner.'
    });

    console.log('✅ Created initial Users (Admin, Author, Reader)');

    // 2. Create Published Articles across Categories
    const article1 = await Article.create({
      title: 'The Rise of Quantum Computing & Next-Gen Algorithms',
      description: 'How quantum supercomputers are rewriting cryptography, optimization, and molecular simulations.',
      content: `# The Rise of Quantum Computing

Quantum computing is no longer just theoretical physics—it is reshaping computational chemistry, cryptography, and artificial intelligence.

Unlike classical bits which represent either a 0 or 1, quantum bits (qubits) leverage **superposition** and **entanglement** to perform complex calculations in seconds that would take classical supercomputers millennia.`,
      category: 'Technology',
      tags: ['quantum', 'computing', 'cryptography', 'tech'],
      authorId: author._id,
      status: 'Published',
      readingTime: 6,
      submittedAt: new Date()
    });

    const article2 = await Article.create({
      title: 'Deep Ocean Exploration: Discovering Earth’s Final Frontier',
      description: 'Exploring abyssal plains, hydrothermal vents, and bioluminescent ecosystems miles beneath the surface.',
      content: `# Deep Ocean Exploration

More than 80 percent of the ocean remains unmapped, unobserved, and unexplored. Deep-sea submersibles are now uncovering mysterious ecosystems thriving without sunlight.`,
      category: 'Environment',
      tags: ['ocean', 'marine', 'earth', 'nature'],
      authorId: author._id,
      status: 'Published',
      readingTime: 4,
      submittedAt: new Date()
    });

    const article3 = await Article.create({
      title: 'The History of the ARPANET and the Modern Internet',
      description: 'From a packet-switching network in 1969 to a global information superhighway.',
      content: `# ARPANET and the Birth of the Internet

In October 1969, researchers at UCLA and Stanford established the first node-to-node communication using packet switching, creating the backbone of what we know today as the Internet.`,
      category: 'History',
      tags: ['history', 'arpanet', 'internet', 'networking'],
      authorId: author._id,
      status: 'Published',
      readingTime: 5,
      submittedAt: new Date()
    });

    console.log('✅ Created Published Articles');

    // 3. Create Attached Quizzes
    const quiz1 = await Quiz.create({
      articleId: article1._id,
      authorId: author._id,
      title: 'Quantum Computing Quiz',
      description: 'Test your understanding of quantum bits and superposition.',
      status: 'Published',
      questions: [
        {
          question: 'What fundamental quantum phenomenon allows qubits to exist in multiple states simultaneously?',
          options: ['Superposition', 'Refraction', 'Photosynthesis', 'Thermal Equilibrium'],
          correctAnswer: 0,
          explanation: 'Superposition allows a quantum system to be in a linear combination of states until measured.'
        },
        {
          question: 'What is quantum entanglement?',
          options: [
            'Particles moving at the speed of light',
            'A phenomenon where quantum states of two particles become interconnected regardless of distance',
            'Overheating of quantum processors',
            'Classical binary encryption'
          ],
          correctAnswer: 1,
          explanation: 'Quantum entanglement links particles such that the state of one instantly dictates the state of another.'
        }
      ]
    });

    const quiz3 = await Quiz.create({
      articleId: article3._id,
      authorId: author._id,
      title: 'ARPANET & Internet History Quiz',
      description: 'How well do you know early internet history?',
      status: 'Published',
      questions: [
        {
          question: 'ARPANET, the precursor to the internet, sent its first message in which year?',
          options: ['1965', '1969', '1973', '1979'],
          correctAnswer: 1,
          explanation: 'ARPANET sent its first message on October 29, 1969, between UCLA and the Stanford Research Institute.'
        },
        {
          question: 'What was the intended first message sent over ARPANET before the system crashed?',
          options: ['Hello', 'Login', 'Start', 'Connect'],
          correctAnswer: 1,
          explanation: 'The intended message was "LOGIN" — only "LO" was transmitted before the buffer crashed.'
        },
        {
          question: 'What does HTTP stand for?',
          options: [
            'HyperText Transfer Protocol',
            'HighText Transfer Protocol',
            'HyperText Transmission Program',
            'High Transfer Text Protocol'
          ],
          correctAnswer: 0,
          explanation: 'HTTP stands for HyperText Transfer Protocol, the protocol used by web browsers and web servers.'
        }
      ]
    });

    console.log('✅ Created Quizzes attached to articles');

    // 4. Create a Sample Quiz Attempt for the Reader
    await QuizAttempt.create({
      quizId: quiz3._id,
      articleId: article3._id,
      userId: reader._id,
      answers: [
        { questionIndex: 0, question: quiz3.questions[0].question, selectedOption: 1, isCorrect: true, explanation: quiz3.questions[0].explanation },
        { questionIndex: 1, question: quiz3.questions[1].question, selectedOption: 1, isCorrect: true, explanation: quiz3.questions[1].explanation },
        { questionIndex: 2, question: quiz3.questions[2].question, selectedOption: 0, isCorrect: true, explanation: quiz3.questions[2].explanation }
      ],
      score: 3,
      total: 3,
      percentage: 100
    });

    console.log('✅ Created Sample Quiz Attempt');

    // 5. Create Initial Notifications
    await Notification.create([
      {
        userId: author._id,
        type: 'article_approved',
        title: 'Article Approved & Published!',
        message: 'Your article "The Rise of Quantum Computing" was reviewed and published by Admin.',
        link: `/articles/${article1._id}`,
        read: false
      },
      {
        userId: author._id,
        type: 'quiz_attempted',
        title: 'New Quiz Attempt',
        message: 'Lena Kaufmann scored 100% on your "ARPANET & Internet History Quiz"!',
        link: `/articles/${article3._id}`,
        read: false
      },
      {
        userId: reader._id,
        type: 'system',
        title: 'Welcome to Lumen',
        message: 'Explore published articles, discover new topics, and test your knowledge with interactive quizzes.',
        link: '/browse',
        read: true
      }
    ]);

    console.log('✅ Created Notifications');

    console.log('\n🎉 Successfully seeded lumen_cms database in Atlas! 🚀\n');
  } catch (error) {
    console.error('❌ Seeding Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
