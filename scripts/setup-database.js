// Database setup script for StreamSphere
// This script creates the necessary tables for the application

const { Pool } = require("pg")

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "streamsphere",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
})

async function setupDatabase() {
  const client = await pool.connect()

  try {
    console.log("Setting up StreamSphere database...")

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100),
        avatar_url TEXT,
        bio TEXT,
        follower_count INTEGER DEFAULT 0,
        following_count INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // Create streams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS streams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        thumbnail_url TEXT,
        rtmp_url TEXT,
        playback_url TEXT,
        status VARCHAR(20) DEFAULT 'offline',
        viewer_count INTEGER DEFAULT 0,
        max_viewers INTEGER DEFAULT 0,
        started_at TIMESTAMP WITH TIME ZONE,
        ended_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // Create stream_tags table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stream_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
        tag VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // Create follows table
    await client.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
        following_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(follower_id, following_id)
      );
    `)

    // Create chat_messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_highlighted BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    // Create stream_analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stream_analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        viewer_count INTEGER DEFAULT 0,
        chat_messages_count INTEGER DEFAULT 0,
        new_followers INTEGER DEFAULT 0,
        engagement_score DECIMAL(5,2) DEFAULT 0.00
      );
    `)

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_streams_user_id ON streams(user_id);
      CREATE INDEX IF NOT EXISTS idx_streams_status ON streams(status);
      CREATE INDEX IF NOT EXISTS idx_streams_category ON streams(category);
      CREATE INDEX IF NOT EXISTS idx_stream_tags_stream_id ON stream_tags(stream_id);
      CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
      CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_stream_id ON chat_messages(stream_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_stream_analytics_stream_id ON stream_analytics(stream_id);
      CREATE INDEX IF NOT EXISTS idx_stream_analytics_timestamp ON stream_analytics(timestamp);
    `)

    console.log("Database setup completed successfully!")

    // Insert some sample data
    console.log("Inserting sample data...")

    // Sample users
    await client.query(`
      INSERT INTO users (username, email, password_hash, display_name, bio, is_verified)
      VALUES 
        ('techarchitect', 'tech@example.com', '$2b$10$hash1', 'Tech Architect', 'Building scalable systems', true),
        ('reactmaster', 'react@example.com', '$2b$10$hash2', 'React Master', 'Frontend development expert', true),
        ('cloudnative', 'cloud@example.com', '$2b$10$hash3', 'Cloud Native', 'Kubernetes and DevOps specialist', false)
      ON CONFLICT (username) DO NOTHING;
    `)

    // Sample streams
    await client.query(`
      INSERT INTO streams (user_id, title, description, category, status, viewer_count)
      SELECT 
        u.id,
        'Building Microservices Architecture',
        'Learn how to design and implement scalable microservices',
        'Technology',
        'live',
        1245
      FROM users u WHERE u.username = 'techarchitect'
      ON CONFLICT DO NOTHING;
    `)

    console.log("Sample data inserted successfully!")
  } catch (error) {
    console.error("Error setting up database:", error)
    throw error
  } finally {
    client.release()
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log("Database setup completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Database setup failed:", error)
    process.exit(1)
  })
