// Analytics seeding script for StreamSphere
// This script generates sample analytics data for testing

const { Pool } = require("pg")

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "streamsphere",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
})

async function seedAnalytics() {
  const client = await pool.connect()

  try {
    console.log("Seeding analytics data...")

    // Get all streams
    const streamsResult = await client.query("SELECT id FROM streams WHERE status = $1", ["live"])
    const streams = streamsResult.rows

    if (streams.length === 0) {
      console.log("No live streams found. Creating sample stream first...")

      // Create a sample user and stream
      const userResult = await client.query(`
        INSERT INTO users (username, email, password_hash, display_name)
        VALUES ('analyticsuser', 'analytics@example.com', '$2b$10$hash', 'Analytics User')
        ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
        RETURNING id;
      `)

      const userId = userResult.rows[0].id

      await client.query(
        `
        INSERT INTO streams (user_id, title, description, category, status, viewer_count)
        VALUES ($1, 'Analytics Demo Stream', 'Demo stream for analytics', 'Technology', 'live', 500)
        RETURNING id;
      `,
        [userId],
      )

      // Re-fetch streams
      const newStreamsResult = await client.query("SELECT id FROM streams WHERE status = $1", ["live"])
      streams.push(...newStreamsResult.rows)
    }

    // Generate analytics data for the last 24 hours
    const now = new Date()
    const hoursBack = 24

    for (const stream of streams) {
      console.log(`Generating analytics for stream ${stream.id}...`)

      for (let i = hoursBack; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)

        // Generate realistic viewer count (varies throughout the day)
        const baseViewers = 500
        const timeOfDay = timestamp.getHours()
        const peakHours = timeOfDay >= 18 && timeOfDay <= 22 // Evening peak
        const viewerMultiplier = peakHours ? 1.5 + Math.random() * 0.5 : 0.7 + Math.random() * 0.6
        const viewerCount = Math.floor(baseViewers * viewerMultiplier)

        // Generate chat activity
        const chatMessagesCount = Math.floor(viewerCount * 0.1 * (0.5 + Math.random()))

        // Generate new followers
        const newFollowers = Math.floor(Math.random() * 10)

        // Calculate engagement score
        const engagementScore = ((chatMessagesCount / viewerCount) * 100).toFixed(2)

        await client.query(
          `
          INSERT INTO stream_analytics (stream_id, timestamp, viewer_count, chat_messages_count, new_followers, engagement_score)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING;
        `,
          [stream.id, timestamp, viewerCount, chatMessagesCount, newFollowers, engagementScore],
        )
      }
    }

    // Generate some sample chat messages
    console.log("Generating sample chat messages...")

    const sampleMessages = [
      "This is really interesting!",
      "Could you explain that in more detail?",
      "Great explanation, thanks!",
      "How does this compare to other approaches?",
      "What tools do you recommend?",
      "Have you tried using Redis for this?",
      "What about performance considerations?",
      "Is this production-ready?",
      "How do you handle errors?",
      "What's the best way to monitor this?",
    ]

    for (const stream of streams) {
      // Get a sample user for chat messages
      const userResult = await client.query("SELECT id FROM users LIMIT 1")
      const userId = userResult.rows[0]?.id

      if (userId) {
        for (let i = 0; i < 20; i++) {
          const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)]
          const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000)

          await client.query(
            `
            INSERT INTO chat_messages (stream_id, user_id, content, created_at)
            VALUES ($1, $2, $3, $4);
          `,
            [stream.id, userId, randomMessage, timestamp],
          )
        }
      }
    }

    console.log("Analytics data seeded successfully!")

    // Display some statistics
    const analyticsCount = await client.query("SELECT COUNT(*) FROM stream_analytics")
    const messagesCount = await client.query("SELECT COUNT(*) FROM chat_messages")

    console.log(`Generated ${analyticsCount.rows[0].count} analytics records`)
    console.log(`Generated ${messagesCount.rows[0].count} chat messages`)
  } catch (error) {
    console.error("Error seeding analytics:", error)
    throw error
  } finally {
    client.release()
  }
}

// Run the seeding
seedAnalytics()
  .then(() => {
    console.log("Analytics seeding completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Analytics seeding failed:", error)
    process.exit(1)
  })
