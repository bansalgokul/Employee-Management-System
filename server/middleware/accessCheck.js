const accessCheck = (role) => {
	return function (req, res, next) {
		if (req.user.roles === role) {
			console.log("in access check");
			next();
		} else {
			return res.status(400).json({ error: "Unauthorized" });
		}
	};
};

module.exports = accessCheck;
