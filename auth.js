const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserProfile = require('../models/UserProfile');

const SALT_ROUNDS = 10;

// ============================================================
// SIGN UP
// ============================================================

router.post('/signup', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      cnic,
      pass,
      role,
      language,
      gender,
      avatar
    } = req.body;

    const normalizedEmail =
      (email || '').trim().toLowerCase();

    const normalizedPhone =
      (phone || '').trim();

    const normalizedCnic =
      (cnic || '').trim();

    // --------------------------------------------------------
    // CHECK EMAIL
    // --------------------------------------------------------

    if (normalizedEmail) {
      const emailExists =
        await UserProfile.findOne({
          email: normalizedEmail
        });

      if (emailExists) {
        return res.json({
          success: false,
          error:
            'An account with this email already exists. Please sign in.'
        });
      }
    }

    // --------------------------------------------------------
    // CHECK PHONE
    // --------------------------------------------------------

    if (normalizedPhone) {
      const phoneExists =
        await UserProfile.findOne({
          phone: normalizedPhone
        });

      if (phoneExists) {
        return res.json({
          success: false,
          error:
            'An account with this phone number already exists. Please sign in.'
        });
      }
    }

    // --------------------------------------------------------
    // CHECK CNIC
    // --------------------------------------------------------

    if (normalizedCnic) {
      const cnicExists =
        await UserProfile.findOne({
          cnic: normalizedCnic
        });

      if (cnicExists) {
        return res.json({
          success: false,
          error:
            'An account with this CNIC already exists. Please sign in.'
        });
      }
    }

    // --------------------------------------------------------
    // CREATE USER ID
    // --------------------------------------------------------

    const userId =
      'usr_' +
      Date.now() +
      '_' +
      Math.random()
        .toString(36)
        .substring(2, 7);

    // --------------------------------------------------------
    // HASH PASSWORD
    // --------------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        pass,
        SALT_ROUNDS
      );

    // --------------------------------------------------------
    // CREATE USER
    // --------------------------------------------------------

    const newUser =
      await UserProfile.create({
        userId,

        name: name.trim(),

        email: normalizedEmail,

        phone: normalizedPhone,

        ...(normalizedCnic
          ? {
              cnic: normalizedCnic
            }
          : {}),

        role,

        language,

        ...(gender
          ? {
              gender
            }
          : {}),

        ...(avatar
          ? {
              avatar
            }
          : {}),

        password: hashedPassword,

        createdAt:
          new Date().toISOString()
      });

    // --------------------------------------------------------
    // NEVER RETURN PASSWORD
    // --------------------------------------------------------

    const userObj =
      newUser.toObject();

    delete userObj.password;

    res.json({
      success: true,
      user: userObj
    });

  } catch (err) {
    console.error(
      'Signup error:',
      err
    );

    res.json({
      success: false,
      error:
        err.message
    });
  }
});

// ============================================================
// SIGN IN
// ============================================================

router.post('/signin', async (req, res) => {
  try {
    const {
      identifier,
      pass
    } = req.body;

    // --------------------------------------------------------
    // CLEAN INPUT
    // --------------------------------------------------------

    const cleanIdentifier =
      (identifier || '').trim();

    const cleanPassword =
      pass || '';

    // --------------------------------------------------------
    // VALIDATE INPUT
    // --------------------------------------------------------

    if (!cleanIdentifier) {
      return res.json({
        success: false,
        error:
          'Please enter your email, phone number, or CNIC.'
      });
    }

    if (!cleanPassword) {
      return res.json({
        success: false,
        error:
          'Please enter your password.'
      });
    }

    // --------------------------------------------------------
    // NORMALIZE EMAIL
    //
    // Email is case-insensitive.
    // Phone and CNIC are kept exactly as entered
    // except surrounding spaces are removed.
    // --------------------------------------------------------

    const normalizedEmail =
      cleanIdentifier.toLowerCase();

    // --------------------------------------------------------
    // FIND ACCOUNT
    //
    // User can sign in using:
    // 1. Email
    // 2. Phone number
    // 3. CNIC
    //
    // This works regardless of the user's role.
    // --------------------------------------------------------

    const existing =
      await UserProfile.findOne({
        $or: [
          {
            email:
              normalizedEmail
          },
          {
            phone:
              cleanIdentifier
          },
          {
            cnic:
              cleanIdentifier
          }
        ]
      });

    // --------------------------------------------------------
    // ACCOUNT NOT FOUND
    // --------------------------------------------------------

    if (!existing) {
      return res.json({
        success: false,
        error:
          'No account found with this email, phone number, or CNIC.'
      });
    }

    // --------------------------------------------------------
    // CHECK PASSWORD
    // --------------------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        cleanPassword,
        existing.password || ''
      );

    if (!passwordMatch) {
      return res.json({
        success: false,
        error:
          'Incorrect password.'
      });
    }

    // --------------------------------------------------------
    // LOGIN SUCCESS
    // --------------------------------------------------------

    const userObj =
      existing.toObject();

    // NEVER SEND PASSWORD TO FRONTEND
    delete userObj.password;

    res.json({
      success: true,
      user: userObj
    });

  } catch (err) {
    console.error(
      'Signin error:',
      err
    );

    res.json({
      success: false,
      error:
        err.message
    });
  }
});

// ============================================================
// DELETE ACCOUNT
// ============================================================

router.post('/delete', async (req, res) => {
  try {
    const {
      userId,
      password
    } = req.body;

    const existing =
      await UserProfile.findOne({
        userId
      });

    if (!existing) {
      return res.json({
        success: false,
        error:
          'Account could not be found.'
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        existing.password || ''
      );

    if (!passwordMatch) {
      return res.json({
        success: false,
        error:
          'Incorrect password.'
      });
    }

    await UserProfile.deleteOne({
      userId
    });

    res.json({
      success: true
    });

  } catch (err) {
    console.error(
      'Delete account error:',
      err
    );

    res.json({
      success: false,
      error:
        err.message
    });
  }
});

module.exports = router;