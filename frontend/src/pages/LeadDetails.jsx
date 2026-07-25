import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import API from "../services/api";

import {
    getMembers,
} from "../services/userService";

import {
    useAuth,
} from "../context/AuthContext";

import "../styles/LeadDetails.css";

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [lead, setLead] = useState(null);

    const [activities, setActivities] =
        useState([]);

    const [notes, setNotes] =
        useState([]);

    const [members, setMembers] =
        useState([]);

    const [note, setNote] =
        useState("");

    const [selectedMember, setSelectedMember] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [noteLoading, setNoteLoading] =
        useState(false);

    const [assigning, setAssigning] =
        useState(false);

    const [error, setError] =
        useState("");

    const [noteError, setNoteError] =
        useState("");

    const [assignError, setAssignError] =
        useState("");

    const [followUps, setFollowUps] = useState([]);

    const [action, setAction] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [followUpLoading, setFollowUpLoading] =
        useState(false);

    const [followUpError, setFollowUpError] =
        useState("");

    /*
    ========================================
    FETCH LEAD + ACTIVITIES + NOTES
    ========================================
    */

    const fetchLeadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                leadResponse,
                activityResponse,
                notesResponse,
                followUpResponse,
            ] = await Promise.all([
                API.get(`/leads/${id}`),
                API.get(`/leads/${id}/activities`),
                API.get(`/leads/${id}/notes`),
                API.get(`/leads/${id}/followups`),
            ]);

            const leadData =
                leadResponse.data.data;

            setLead(leadData);

            setActivities(
                activityResponse.data.data || []
            );

            setNotes(
                notesResponse.data.data || []
            );

            setFollowUps(
                followUpResponse.data.data || []
            );

            // If lead is already assigned,
            // select that member in dropdown
            if (leadData.assignedTo) {
                setSelectedMember(
                    leadData.assignedTo._id
                );
            } else {
                setSelectedMember("");
            }

        } catch (error) {
            console.error(
                "Failed to fetch lead:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load lead details."
            );
        } finally {
            setLoading(false);
        }
    };


    /*
    ========================================
    FETCH MEMBERS
    ADMIN ONLY
    ========================================
    */

    const fetchMembers = async () => {
        try {
            const response =
                await getMembers();

            setMembers(
                response.data.members || []
            );

        } catch (error) {
            console.error(
                "Failed to fetch members:",
                error
            );

            setAssignError(
                error.response?.data?.message ||
                "Failed to load team members."
            );
        }
    };


    /*
    ========================================
    INITIAL LOAD
    ========================================
    */

    useEffect(() => {
        fetchLeadData();

        if (user?.role === "ADMIN") {
            fetchMembers();
        }
    }, [id, user?.role]);


    /*
    ========================================
    UPDATE STATUS
    ========================================
    */

    const handleStatusChange = async (
        event
    ) => {
        const newStatus =
            event.target.value;

        try {
            await API.patch(
                `/leads/${id}`,
                {
                    status: newStatus,
                }
            );

            await fetchLeadData();

        } catch (error) {
            console.error(
                "Failed to update status:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update status."
            );
        }
    };


    /*
    ========================================
    ASSIGN LEAD
    ADMIN ONLY
    ========================================
    */

    const handleAssignLead = async () => {
        if (!selectedMember) {
            setAssignError(
                "Please select a team member."
            );

            return;
        }

        try {
            setAssigning(true);
            setAssignError("");

            await API.patch(
                `/leads/${id}/assign`,
                {
                    assignedTo:
                        selectedMember,
                }
            );

            // Reload lead and activity
            await fetchLeadData();

            alert(
                "Lead assigned successfully."
            );

        } catch (error) {
            console.error(
                "Failed to assign lead:",
                error
            );

            setAssignError(
                error.response?.data?.message ||
                "Failed to assign lead."
            );

        } finally {
            setAssigning(false);
        }
    };


    /*
    ========================================
    ADD NOTE
    ========================================
    */

    const handleAddNote = async (
        event
    ) => {
        event.preventDefault();

        if (!note.trim()) {
            setNoteError(
                "Please enter a note."
            );

            return;
        }

        try {
            setNoteLoading(true);
            setNoteError("");

            await API.post(
                `/leads/${id}/notes`,
                {
                    content:
                        note.trim(),
                }
            );

            setNote("");

            await fetchLeadData();

        } catch (error) {
            console.error(
                "Failed to add note:",
                error
            );

            setNoteError(
                error.response?.data?.message ||
                "Failed to add note."
            );

        } finally {
            setNoteLoading(false);
        }
    };

    const handleCreateFollowUp = async (event) => {
        event.preventDefault();

        if (!action.trim() || !dueDate) {
            setFollowUpError(
                "Action and due date are required."
            );
            return;
        }

        try {
            setFollowUpLoading(true);
            setFollowUpError("");

            await API.post(
                `/leads/${id}/followups`,
                {
                    action,
                    dueDate,
                }
            );

            setAction("");
            setDueDate("");

            await fetchLeadData();

        } catch (error) {
            console.error(
                "Failed to create follow-up:",
                error
            );

            setFollowUpError(
                error.response?.data?.message ||
                "Failed to create follow-up."
            );

        } finally {
            setFollowUpLoading(false);
        }
    };

    const handleCompleteFollowUp = async (
        followUpId
    ) => {
        try {
            await API.patch(
                `/leads/${id}/followups/${followUpId}`
            );

            await fetchLeadData();

        } catch (error) {
            console.error(
                "Failed to complete follow-up:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to complete follow-up."
            );
        }
    };


    /*
    ========================================
    LOADING
    ========================================
    */

    if (loading) {
        return (
            <div className="lead-details-loading">
                Loading lead...
            </div>
        );
    }


    /*
    ========================================
    ERROR
    ========================================
    */

    if (error) {
        return (
            <div className="lead-details-error">
                {error}
            </div>
        );
    }


    /*
    ========================================
    LEAD NOT FOUND
    ========================================
    */

    if (!lead) {
        return (
            <div className="lead-details-error">
                Lead not found.
            </div>
        );
    }


    /*
    ========================================
    UI
    ========================================
    */

    return (
        <div className="lead-details-page">

            {/* =================================
          HEADER
      ================================= */}

            <div className="lead-details-header">

                <div>

                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate("/leads")
                        }
                    >
                        ← Back to Leads
                    </button>

                    <h2>
                        {lead.name}
                    </h2>

                    <p>
                        {lead.company ||
                            "No company provided"}
                    </p>

                </div>


                {/* STATUS */}

                <select
                    className="status-select"
                    value={
                        lead.status || "NEW"
                    }
                    onChange={
                        handleStatusChange
                    }
                >

                    <option value="NEW">
                        New
                    </option>

                    <option value="CONTACTED">
                        Contacted
                    </option>

                    <option value="QUALIFIED">
                        Qualified
                    </option>

                    <option value="WON">
                        Won
                    </option>

                    <option value="LOST">
                        Lost
                    </option>

                </select>

            </div>


            {/* =================================
          ADMIN ASSIGNMENT
      ================================= */}

            {user?.role === "ADMIN" && (

                <div className="assignment-card">

                    <div className="assignment-header">

                        <div>

                            <h3>
                                Assign Lead
                            </h3>

                            <p>
                                Assign this lead to
                                a team member.
                            </p>

                        </div>

                        <div className="current-assignee">

                            <span>
                                Current Owner
                            </span>

                            <strong>
                                {lead.assignedTo?.name ||
                                    "Unassigned"}
                            </strong>

                        </div>

                    </div>


                    <div className="assignment-controls">

                        <select
                            value={
                                selectedMember
                            }
                            onChange={(event) =>
                                setSelectedMember(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                Select team member
                            </option>

                            {members.map(
                                (member) => (

                                    <option
                                        key={
                                            member._id
                                        }
                                        value={
                                            member._id
                                        }
                                    >
                                        {member.name} (
                                        {member.email})
                                    </option>

                                )
                            )}

                        </select>


                        <button
                            type="button"
                            onClick={
                                handleAssignLead
                            }
                            disabled={
                                assigning
                            }
                        >
                            {assigning
                                ? "Assigning..."
                                : "Assign Lead"}
                        </button>

                    </div>


                    {assignError && (

                        <p className="assignment-error">
                            {assignError}
                        </p>

                    )}

                </div>

            )}


            {/* =================================
          MAIN GRID
      ================================= */}

            <div className="lead-details-grid">


                {/* =================================
            LEFT COLUMN
        ================================= */}

                <div className="lead-info-card">

                    <h3>
                        Lead Information
                    </h3>


                    <div className="info-item">

                        <span>
                            Name
                        </span>

                        <strong>
                            {lead.name}
                        </strong>

                    </div>


                    <div className="info-item">

                        <span>
                            Email
                        </span>

                        <strong>
                            {lead.email}
                        </strong>

                    </div>


                    <div className="info-item">

                        <span>
                            Phone
                        </span>

                        <strong>
                            {lead.phone ||
                                "Not provided"}
                        </strong>

                    </div>


                    <div className="info-item">

                        <span>
                            Company
                        </span>

                        <strong>
                            {lead.company ||
                                "Not provided"}
                        </strong>

                    </div>


                    <div className="info-item">

                        <span>
                            Source
                        </span>

                        <strong>
                            {lead.source ||
                                "Not provided"}
                        </strong>

                    </div>


                    <div className="info-item">

                        <span>
                            Status
                        </span>

                        <strong>
                            {lead.status}
                        </strong>

                    </div>


                    <div className="info-item">

                        <span>
                            Assigned To
                        </span>

                        <strong>
                            {lead.assignedTo?.name ||
                                "Unassigned"}
                        </strong>

                    </div>


                    <div className="info-item">

                        <span>
                            Created
                        </span>

                        <strong>
                            {new Date(
                                lead.createdAt
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>

                </div>


                {/* =================================
            RIGHT COLUMN - ACTIVITY
        ================================= */}

                <div className="activity-card">

                    <h3>
                        Activity Timeline
                    </h3>


                    {activities.length === 0 ? (

                        <p className="empty-text">
                            No activity yet.
                        </p>

                    ) : (

                        <div className="activity-list">

                            {activities.map(
                                (activity) => (

                                    <div
                                        className="activity-item"
                                        key={
                                            activity._id
                                        }
                                    >

                                        <div className="activity-dot">
                                            ●
                                        </div>


                                        <div>

                                            <strong>
                                                {activity.type}
                                            </strong>

                                            <p>
                                                {
                                                    activity.description
                                                }
                                            </p>

                                            <small>
                                                {new Date(
                                                    activity.createdAt
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </small>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>


            {/* =================================
          NOTES
      ================================= */}

            <div className="notes-card">

                <h3>
                    Notes
                </h3>


                <form
                    onSubmit={
                        handleAddNote
                    }
                >

                    <textarea
                        placeholder="Write a note about this lead..."
                        value={note}
                        onChange={(event) =>
                            setNote(
                                event.target.value
                            )
                        }
                    />


                    {noteError && (

                        <p className="note-error">
                            {noteError}
                        </p>

                    )}


                    <button
                        type="submit"
                        disabled={
                            noteLoading
                        }
                    >
                        {noteLoading
                            ? "Adding..."
                            : "Add Note"}
                    </button>

                </form>


                <div className="notes-list">

                    {notes.length === 0 ? (

                        <p className="empty-text">
                            No notes added yet.
                        </p>

                    ) : (

                        notes.map(
                            (item) => (

                                <div
                                    className="note-item"
                                    key={
                                        item._id
                                    }
                                >

                                    <p>
                                        {item.content}
                                    </p>

                                    <small>
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </small>

                                </div>

                            )
                        )

                    )}

                </div>

            </div>

            {/* FOLLOW-UPS */}

            <div className="followups-card">

                <h3>
                    Follow-ups
                </h3>

                <form
                    onSubmit={handleCreateFollowUp}
                    className="followup-form"
                >

                    <input
                        type="text"
                        placeholder="Follow-up action..."
                        value={action}
                        onChange={(event) =>
                            setAction(event.target.value)
                        }
                    />

                    <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(event) =>
                            setDueDate(event.target.value)
                        }
                    />

                    {followUpError && (
                        <p className="followup-error">
                            {followUpError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={followUpLoading}
                    >
                        {followUpLoading
                            ? "Creating..."
                            : "Create Follow-up"}
                    </button>

                </form>


                <div className="followups-list">

                    {followUps.length === 0 ? (

                        <p className="empty-text">
                            No follow-ups scheduled.
                        </p>

                    ) : (

                        followUps.map((followUp) => (

                            <div
                                className="followup-item"
                                key={followUp._id}
                            >

                                <div>

                                    <strong>
                                        {followUp.action}
                                    </strong>

                                    <p>
                                        Due:{" "}
                                        {new Date(
                                            followUp.dueDate
                                        ).toLocaleString("en-IN")}
                                    </p>

                                    <span>
                                        Status:{" "}
                                        {followUp.status === "COMPLETED"
                                            ? "Completed"
                                            : followUp.status === "OVERDUE"
                                                ? "Overdue"
                                                : "Pending"}
                                    </span>

                                </div>

                                {followUp.status !== "COMPLETED" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCompleteFollowUp(
                                                followUp._id
                                            )
                                        }
                                    >
                                        Mark Complete
                                    </button>
                                )}

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>
    );
};

export default LeadDetails;