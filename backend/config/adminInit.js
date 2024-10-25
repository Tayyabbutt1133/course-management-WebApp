// config/adminInit.js
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const initializeAdmin = async () => {
    try {
        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });
        
        if (!adminExists) {
            // Create admin if doesn't exist
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            const admin = new User({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log('✅ Admin user initialized successfully');
        } else {
            console.log('ℹ️ Admin user already exists');
        }
    } catch (error) {
        console.error('❌ Error initializing admin:', error);
    }
};

export default initializeAdmin;