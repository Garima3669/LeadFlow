import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import API from "../services/api";

import "../styles/Leads.css";

import { useAuth } from "../context/AuthContext";

const Leads = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    console.log("CURRENT USER:", user);

    const [leads, setLeads] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pagination, setPagination] =
        useState({
            total: 0,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
        });

    const [filters, setFilters] =
        useState({
            search: "",
            status: "",
        });


    const fetchLeads = async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            params.append("page", page);
            params.append("limit", 10);

            if (filters.search) {
                params.append(
                    "search",
                    filters.search
                );
            }

            if (filters.status) {
                params.append(
                    "status",
                    filters.status
                );
            }

            const response = await API.get(
                `/leads?${params.toString()}`
            );

            console.log("FULL LEADS RESPONSE:", response.data);

            console.log(
                "LEADS ARRAY:",
                response.data?.data?.leads
            );

            setLeads(
                response.data?.data?.leads || []
            );

            setPagination(
                response.data?.data?.pagination || {
                    total: 0,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPreviousPage: false,
                }
            );

        } catch (error) {
            console.error(
                "Failed to fetch leads:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load leads"
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchLeads();
    }, [page, filters.status]);


    const handleSearch = (event) => {
        event.preventDefault();

        if (page !== 1) {
            setPage(1);
            return;
        }

        fetchLeads();
    };


    const handleStatusChange = (
        event
    ) => {
        setPage(1);

        setFilters({
            ...filters,
            status:
                event.target.value,
        });
    };


    const getStatusClass = (
        status
    ) => {
        return `status-badge status-${status.toLowerCase()}`;
    };


    if (loading) {
        return (
            <div className="leads-loading">
                Loading leads...
            </div>
        );
    }


    return (
        <div className="leads-page">

            {/* HEADER */}

            <div className="leads-header">

                <div>
                    <h2>
                        Leads
                    </h2>

                    <p>
                        Manage and track your
                        sales opportunities.
                    </p>
                </div>

                <Link
                    to="/leads/new"
                    className="create-lead-btn"
                >
                    + Add Lead
                </Link>

            </div>


            {/* FILTERS */}

            <div className="leads-filters">

                <form
                    onSubmit={
                        handleSearch
                    }
                    className="search-form"
                >

                    <input
                        type="text"
                        placeholder="Search by name, email or company..."
                        value={
                            filters.search
                        }
                        onChange={(event) =>
                            setFilters({
                                ...filters,
                                search:
                                    event.target.value,
                            })
                        }
                    />

                    <button type="submit">
                        Search
                    </button>

                </form>


                <select
                    value={
                        filters.status
                    }
                    onChange={
                        handleStatusChange
                    }
                >

                    <option value="">
                        All Statuses
                    </option>

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


            {/* ERROR */}

            {error && (
                <div className="leads-error">
                    {error}
                </div>
            )}


            {/* TABLE */}

            <div className="leads-table-container">

                <table className="leads-table">

                    <thead>

                        <tr>

                            <th>
                                Lead
                            </th>

                            <th>
                                Company
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Assigned To
                            </th>

                            <th>
                                Created
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {leads.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty-state"
                                >
                                    No leads found.
                                </td>

                            </tr>

                        ) : (

                            leads.map((lead) => (

                                <tr
                                    key={
                                        lead._id
                                    }
                                >

                                    <td>

                                        <div className="lead-info">

                                            <strong>
                                                {lead.name}
                                            </strong>

                                            <span>
                                                {lead.email}
                                            </span>

                                        </div>

                                    </td>


                                    <td>
                                        {lead.company ||
                                            "—"}
                                    </td>


                                    <td>

                                        <span
                                            className={
                                                getStatusClass(
                                                    lead.status
                                                )
                                            }
                                        >
                                            {lead.status}
                                        </span>

                                    </td>


                                    <td>

                                        {lead.assignedTo
                                            ? lead.assignedTo.name
                                            : "Unassigned"}

                                    </td>


                                    <td>

                                        {new Date(
                                            lead.createdAt
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )}

                                    </td>


                                    <td>

                                        <button
                                            className="view-lead-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/leads/${lead._id}`
                                                )
                                            }
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>


            {/* PAGINATION */}

            <div className="pagination">

                <button
                    disabled={
                        !pagination.hasPreviousPage
                    }
                    onClick={() =>
                        setPage(
                            page - 1
                        )
                    }
                >
                    ← Previous
                </button>


                <span>
                    Page {page} of{" "}
                    {pagination.totalPages}
                </span>


                <button
                    disabled={
                        !pagination.hasNextPage
                    }
                    onClick={() =>
                        setPage(
                            page + 1
                        )
                    }
                >
                    Next →
                </button>

            </div>

        </div>
    );
};

export default Leads;