const dashboardService = require(
    "../services/dashboardService"
);

const getDashboardStats = async (
    req,
    res,
    next
) => {
    try {
        const stats =
            await dashboardService.getDashboardStats(
                req.user
            );

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

const getRecentActivities = async (
    req,
    res,
    next
) => {
    try {
        const activities =
            await dashboardService.getRecentActivities(
                req.query.limit || 5
            );

        res.status(200).json({
            success: true,
            data: activities,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getRecentActivities,
};