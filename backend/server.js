import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mahekkhureshii786_db_user:Mahek92@cluster0.5q4y577.mongodb.net/companydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Company Schema
const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    industry: { type: String, required: true },
});

const Company = mongoose.model('Company', companySchema);

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/api/companies', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/companies', async (req, res) => {
    const company = new Company(req.body);
    try {
        const newCompany = await company.save();
        res.status(201).json(newCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.put('/api/companies/update/:id', async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // return updated document
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json(updatedCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/companies/delete/:id', async (req, res) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.params.id);
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Auth Routes
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed data
const seedData = async () => {
    try {
        const companyCount = await Company.countDocuments();
        if (companyCount === 0) {
            const companies = [
                { name: 'TechCorp', location: 'New York', industry: 'Technology' },
                { name: 'HealthMed', location: 'California', industry: 'Healthcare' },
                { name: 'FinancePlus', location: 'Texas', industry: 'Finance' },
                { name: 'EduLearn', location: 'Florida', industry: 'Education' },
                { name: 'GreenEnergy', location: 'Colorado', industry: 'Energy' },
                { name: 'RetailHub', location: 'New York', industry: 'Retail' },
                { name: 'AutoDrive', location: 'Michigan', industry: 'Automotive' },
                { name: 'FoodieDelight', location: 'California', industry: 'Food & Beverage' },
                { name: 'TravelWorld', location: 'Nevada', industry: 'Travel' },
                { name: 'MediaStream', location: 'New York', industry: 'Media' },
            ];
            await Company.insertMany(companies);
            console.log('Database seeded with sample companies');
        }

        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const users = [
                { email: 'user@example.com', password: hashedPassword },
                { email: 'admin@example.com', password: hashedPassword },
            ];
            await User.insertMany(users);
            console.log('Database seeded with sample users');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

seedData();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
