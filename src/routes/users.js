const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.send('User saved');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            'your_jwt_secret', // replace 'your_jwt_secret' with your own secret string
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/me', auth, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

router.put('/me', auth, async (req, res) => {
  const { preferences } = req.body;

  try {
      let user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      user.preferences = preferences;
      await user.save();

      res.json(user);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});


module.exports = router;
