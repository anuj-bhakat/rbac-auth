import User from '../models/user.js';

export const registerUser = (req, res) => {
    const { username, password, role } = req.body;
    const user = new User({ username, role });

    User.register(user, password, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        } else {
            req.login(user, (er) => {
                if (er) {
                    res.json({ success: false, message: er });
                } else {
                    res.json({ success: true, message: "Your account has been saved" });
                }
            });
        }
    });
};

export const loginUser = (req, res) => {
    return res.json({
        session: req.session,
        user: req.user,
    });
};

export const showAll = async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const checkSession = (req, res) => {
    if (req.user) {
        return res.status(200).json({
        isAuthenticated: true,
        user: {
            username: req.user.username,
            role: req.user.role
        }
        });
    }

  return res.status(200).json({
    isAuthenticated: false,
    message: "No active session"
  });
};


export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Session destruction failed" });
      }

      res.clearCookie("connect.sid"); // or whatever your session cookie name is
      return res.status(200).json({ success: true, message: "Logged out successfully" });
    });
  });
};
