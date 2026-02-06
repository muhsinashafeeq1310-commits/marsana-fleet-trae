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

async function seedUser() {
  console.log('Seeding dummy user...');

  const user = {
    email: 'admin@marsana.com',
    full_name: 'Super Admin',
    role: 'super_admin',
    is_active: true
  };

  // Check if user exists in auth.users?
  // We can't insert into auth.users directly via client easily without admin API.
  // But we need a row in public.users.
  // The public.users table has a foreign key to auth.users(id).
  // So we MUST have a real auth user.
  
  // Since we are "pretending", we can disable the FK constraint or insert a dummy UUID if the constraint allows it (it won't).
  // OR we create a real user via auth.admin.createUser.
  
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: user.email,
    password: 'password123',
    email_confirm: true
  });

  if (authError) {
    console.log('Auth user creation failed (maybe exists):', authError.message);
    // If exists, try to find it? We can't query auth.users easily.
    // Let's assume if it fails, we might check public.users.
  }

  if (authUser?.user) {
    console.log('Created auth user:', authUser.user.id);
    
    // Insert into public.users
    const { error: publicError } = await supabase
        .from('users')
        .upsert({
            id: authUser.user.id,
            ...user
        })
        .select();
        
    if (publicError) console.error('Public user insert failed:', publicError.message);
    else console.log('Public user seeded.');
  }
}

seedUser();
