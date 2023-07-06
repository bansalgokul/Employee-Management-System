const accessCheck = (roles) => {
	return function (req, res, next) {
		if (req.user.roles === roles) {
			next();
		} else {
			return res.status(400).json({ error: "Unauthorized" });
		}
	};
};

export default accessCheck;
