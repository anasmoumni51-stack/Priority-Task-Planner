// Sample data seeding script for Task Planner
// Run with: node seed.js

const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('../models/Task');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB');

    // Clear existing data
    await Task.deleteMany({});
    console.log(' Cleared existing tasks');

    // Sample tasks demonstrating flexible schema
    const sampleTasks = [
      {
        title: "Complete project proposal",
        description: "Write and submit Q1 project proposal for client",
        priority: 4,
        category: "work",
        taskType: "work",
        project: "Q1 Planning",
        deadline: new Date("2026-02-01"),
        assignedTo: "John Doe",
        estimatedHours: 8,
        tags: ["urgent", "planning", "client-work"],
        status: "in-progress"
      },
      {
        title: "Buy groceries",
        description: "Weekly grocery shopping for the family",
        priority: 2,
        category: "personal",
        taskType: "shopping",
        items: ["milk", "bread", "eggs", "cheese", "vegetables"],
        store: "Whole Foods",
        budget: 75,
        estimatedTime: "1 hour"
      },
      {
        title: "Doctor appointment",
        description: "Annual physical checkup",
        priority: 3,
        category: "health",
        taskType: "health",
        doctorName: "Dr. Sarah Johnson",
        appointmentTime: "10:00 AM",
        clinic: "City Medical Center",
        symptoms: [],
        followUpNeeded: false
      },
      {
        title: "Study for JavaScript exam",
        description: "Review ES6 features and Node.js concepts",
        priority: 4,
        category: "school",
        taskType: "education",
        subject: "JavaScript",
        examDate: new Date("2026-01-25"),
        studyHours: 10,
        resources: ["MDN Docs", "Node.js documentation", "Practice exercises"],
        progress: 65
      },
      {
        title: "Plan vacation",
        description: "Research and book summer vacation",
        priority: 1,
        category: "personal",
        taskType: "personal",
        destination: "Bali, Indonesia",
        duration: "2 weeks",
        budget: 3000,
        travelDates: {
          start: new Date("2026-07-01"),
          end: new Date("2026-07-15")
        },
        activities: ["beach", "hiking", "cultural sites"]
      },
      {
        title: "Fix kitchen sink",
        description: "Repair leaky kitchen faucet",
        priority: 3,
        category: "home",
        taskType: "home",
        tools: ["wrench", "plumber's tape", "replacement parts"],
        estimatedCost: 50,
        difficulty: "medium",
        timeEstimate: "2 hours"
      },
      {
        title: "Review code changes",
        description: "Code review for the new authentication feature",
        priority: 3,
        category: "work",
        taskType: "work",
        project: "User Authentication",
        pullRequest: "#123",
        reviewer: "Jane Smith",
        deadline: new Date("2026-01-22"),
        complexity: "high"
      },
      {
        title: "Call mom",
        description: "Weekly catch-up call with mother",
        priority: 2,
        category: "personal",
        taskType: "personal",
        frequency: "weekly",
        duration: "30 minutes",
        importance: "high"
      }
    ];

    // Insert sample data
    const insertedTasks = await Task.insertMany(sampleTasks);
    console.log(` Successfully seeded ${insertedTasks.length} tasks`);

    // Display summary
    console.log('\n Sample Data Summary:');
    console.log(`Total tasks: ${insertedTasks.length}`);

    const stats = await Task.aggregate([
      {
        $group: {
          _id: "$taskType",
          count: { $sum: 1 },
          avgPriority: { $avg: "$priority" }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('Tasks by type:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} tasks (avg priority: ${stat.avgPriority.toFixed(1)})`);
    });

    console.log('\n Sample data seeding completed!');
    console.log('You can now start the server with: npm start');

  } catch (error) {
    console.error(' Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log(' Database connection closed');
  }
}

// Run the seeding function
seedDatabase();