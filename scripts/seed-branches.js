const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedBranches() {
  console.log('Seeding branches...');

  const branches = [
    {
      name: 'Main HQ',
      code: 'HQ',
      location: 'Riyadh, Saudi Arabia',
      is_active: true,
      timezone: 'Asia/Riyadh'
    },
    {
      name: 'Riyadh Branch',
      code: 'RUH',
      location: 'King Fahd Road, Riyadh',
      is_active: true,
      timezone: 'Asia/Riyadh'
    },
    {
      name: 'Dammam Branch',
      code: 'DMM',
      location: 'Corniche Road, Dammam',
      is_active: true,
      timezone: 'Asia/Riyadh'
    },
    {
      name: 'Jeddah Branch',
      code: 'JED',
      location: 'Prince Sultan St, Jeddah',
      is_active: true,
      timezone: 'Asia/Riyadh'
    }
  ];

  for (const branch of branches) {
    const { data, error } = await supabase
      .from('branches')
      .upsert(branch, { onConflict: 'code' })
      .select();

    if (error) {
      console.error(`Error inserting branch ${branch.name}:`, error.message);
    } else {
      console.log(`Upserted branch: ${branch.name}`);
    }
  }

  console.log('Branch seeding complete.');
}

seedBranches();
