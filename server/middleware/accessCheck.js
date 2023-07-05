const accessCheck = (roles) => {
	return function (req, res, next) {
		if (req.user.roles === roles) {
			console.log("in access check");
			next();
		} else {
			return res.status(400).json({ error: "Unauthorized" });
		}
	};
};

module.exports = accessCheck;
