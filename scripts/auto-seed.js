// Automatic Database Seeding for Vercel
// This script runs after deployment to seed the database

const https = require('https');
const http = require('http');

async function seedDatabase() {
  console.log('🌱 Starting automatic database seeding...');
  
  // Get the deployment URL from environment
  const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  
  if (!vercelUrl) {
    console.log('⚠️  No VERCEL_URL found. Skipping auto-seed.');
    console.log('💡 You can manually seed by visiting: https://your-app.vercel.app/api/seed');
    process.exit(0);
  }

  // Construct the full URL
  const protocol = vercelUrl.startsWith('localhost') ? 'http' : 'https';
  const url = `${protocol}://${vercelUrl}/api/seed`;
  
  console.log(`🎯 Target: ${url}`);
  
  // Wait a bit for the deployment to be fully ready
  console.log('⏳ Waiting 10 seconds for deployment to stabilize...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  return new Promise((resolve, reject) => {
    const lib = protocol === 'https' ? https : http;
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000 // 30 seconds timeout
    };
    
    console.log('📡 Sending seed request...');
    
    const req = lib.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (result.success || result.seeded || result.message?.includes('already seeded')) {
            console.log('✅ Database seeded successfully!');
            console.log(`📊 Results:`, JSON.stringify(result, null, 2));
            resolve(result);
          } else {
            console.log('⚠️  Seeding response:', data);
            resolve(result);
          }
        } catch (e) {
          console.log('⚠️  Could not parse response:', data);
          resolve({ warning: 'Response parsing failed', data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('⚠️  Seed request failed:', error.message);
      console.log('💡 This is OK if it\'s the first deployment. You can manually seed later.');
      resolve({ error: error.message });
    });
    
    req.on('timeout', () => {
      console.log('⚠️  Seed request timed out');
      console.log('💡 The database might still be seeding. Check your app later.');
      req.destroy();
      resolve({ error: 'timeout' });
    });
    
    req.end();
  });
}

// Run the seeding
seedDatabase()
  .then((result) => {
    console.log('🎉 Auto-seed process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Auto-seed failed:', error);
    console.log('💡 You can manually seed by visiting: /api/seed');
    process.exit(0); // Exit with 0 so deployment doesn't fail
  });
