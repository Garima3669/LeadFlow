import { useEffect, useState } from "react";
import {
    getDashboardStats,
    getRecentActivities
} from "../services/authService";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] =
        useState({
            totalLeads: 0,
            newLeads: 0,
            contactedLeads: 0,
            qualifiedLeads: 0,
            wonLeads: 0,
            lostLeads: 0,
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [activities, setActivities] = useState([]);


    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    statsResponse,
                    activitiesResponse,
                ] = await Promise.all([
                    getDashboardStats(),
                    getRecentActivities(),
                ]);

                setStats(statsResponse.data);

                setActivities(
                    activitiesResponse.data.data
                );
            } catch (error) {
                console.error(
                    "Dashboard error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);


    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );
    }


    if (error) {
        return (
            <div className="dashboard-error">
                {error}
            </div>
        );
    }


    return (
        <div className="dashboard-page">

            {/* =========================
          PAGE HEADER
      ========================= */}

            <div className="dashboard-header">

                <div>
                    <h2>Overview</h2>

                    <p>
                        Here's what's happening
                        with your leads today.
                    </p>
                </div>

                <button
                    className="create-lead-btn"
                    onClick={() =>
                        navigate("/leads/new")
                    }
                >
                    + Create Lead
                </button>

            </div>


            {/* =========================
          STATISTICS
      ========================= */}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-title">
                            Total Leads
                        </span>

                        <span className="stat-icon blue">
                            👥
                        </span>

                    </div>

                    <h3>
                        {stats.totalLeads}
                    </h3>

                    <p className="stat-growth">
                        +12% from last month
                    </p>

                </div>


                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-title">
                            New Leads
                        </span>

                        <span className="stat-icon purple">
                            ✨
                        </span>

                    </div>

                    <h3>
                        {stats.newLeads}
                    </h3>

                    <p className="stat-growth">
                        +8% from last month
                    </p>

                </div>


                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-title">
                            Qualified
                        </span>

                        <span className="stat-icon orange">
                            ⭐
                        </span>

                    </div>

                    <h3>
                        {stats.qualifiedLeads}
                    </h3>

                    <p className="stat-growth">
                        +15% from last month
                    </p>

                </div>


                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-title">
                            Won Leads
                        </span>

                        <span className="stat-icon green">
                            ✓
                        </span>

                    </div>

                    <h3>
                        {stats.wonLeads}
                    </h3>

                    <p className="stat-growth">
                        +10% from last month
                    </p>

                </div>

            </div>


            {/* =========================
          PIPELINE
      ========================= */}

            <div className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h3>
                            Lead Pipeline
                        </h3>

                        <p>
                            Track your leads through
                            each stage.
                        </p>

                    </div>

                    <button
                        className="view-all-btn"
                        onClick={() =>
                            navigate("/leads")
                        }
                    >
                        View All
                    </button>

                </div>


                <div className="pipeline-grid">

                    <div className="pipeline-card">

                        <div className="pipeline-header">

                            <span className="pipeline-dot new">
                            </span>

                            <span>
                                New
                            </span>

                            <strong>
                                {stats.newLeads}
                            </strong>

                        </div>

                        <div className="pipeline-progress">

                            <div
                                className="progress-fill new-progress"
                                style={{
                                    width: `${Math.min(
                                        (stats.newLeads /
                                            stats.totalLeads) *
                                        100,
                                        100
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>


                    <div className="pipeline-card">

                        <div className="pipeline-header">

                            <span className="pipeline-dot contacted">
                            </span>

                            <span>
                                Contacted
                            </span>

                            <strong>
                                {stats.contactedLeads}
                            </strong>

                        </div>

                        <div className="pipeline-progress">

                            <div
                                className="progress-fill contacted-progress"
                                style={{
                                    width: `${Math.min(
                                        (stats.contactedLeads /
                                            stats.totalLeads) *
                                        100,
                                        100
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>


                    <div className="pipeline-card">

                        <div className="pipeline-header">

                            <span className="pipeline-dot qualified">
                            </span>

                            <span>
                                Qualified
                            </span>

                            <strong>
                                {stats.qualifiedLeads}
                            </strong>

                        </div>

                        <div className="pipeline-progress">

                            <div
                                className="progress-fill qualified-progress"
                                style={{
                                    width: `${Math.min(
                                        (stats.qualifiedLeads /
                                            stats.totalLeads) *
                                        100,
                                        100
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>


                    <div className="pipeline-card">

                        <div className="pipeline-header">

                            <span className="pipeline-dot won">
                            </span>

                            <span>
                                Won
                            </span>

                            <strong>
                                {stats.wonLeads}
                            </strong>

                        </div>

                        <div className="pipeline-progress">

                            <div
                                className="progress-fill won-progress"
                                style={{
                                    width: `${Math.min(
                                        (stats.wonLeads /
                                            stats.totalLeads) *
                                        100,
                                        100
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
          RECENT ACTIVITY
      ========================= */}

            <div className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h3>
                            Recent Activity
                        </h3>

                        <p>
                            Latest updates from
                            your sales team.
                        </p>

                    </div>

                    <button
                        className="view-all-btn"
                        onClick={() =>
                            navigate("/leads")
                        }
                    >
                        View Activity
                    </button>

                </div>


                <div className="activity-list">

                    {activities.length === 0 ? (
                        <p className="empty-text">
                            No recent activity.
                        </p>
                    ) : (
                        activities.map((activity) => (
                            <div
                                className="activity-item"
                                key={activity._id}
                            >
                                <div className="activity-icon">
                                    {activity.type === "LEAD_CREATED"
                                        ? "+"
                                        : activity.type === "STATUS_CHANGED"
                                            ? "✓"
                                            : activity.type === "ASSIGNED"
                                                ? "→"
                                                : "•"}
                                </div>

                                <div className="activity-content">
                                    <p>
                                        {activity.description}
                                    </p>

                                    <span>
                                        {new Date(
                                            activity.createdAt
                                        ).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}

                </div>

            </div>

        </div>
    );
};

export default Dashboard;