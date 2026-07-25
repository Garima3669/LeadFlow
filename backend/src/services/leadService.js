const mongoose = require("mongoose");

const Lead = require("../models/Lead");
const User = require("../models/User");

const {
    createActivity,
} = require("./activityService");


/*
==================================================
CREATE LEAD
==================================================
*/

const createLead = async (leadData) => {
    const lead = await Lead.create(
        leadData
    );

    await createActivity({
        type: "LEAD_CREATED",

        description:
            `Lead "${lead.name}" was created`,

        lead: lead._id,

        createdBy: null,
    });

    return lead;
};


/*
==================================================
GET LEADS
Pagination + Filtering + Search
==================================================
*/

const getLeads = async ({
    page = 1,
    limit = 10,
    status,
    assignedTo,
    search,
    user,
}) => {

    page = Math.max(
        Number(page) || 1,
        1
    );

    limit = Math.min(
        Math.max(
            Number(limit) || 10,
            1
        ),
        100
    );

    const skip =
        (page - 1) * limit;

    const filter = {};


    /*
    MEMBER PERMISSION
  
    Members can only see
    their assigned leads
    */

    if (
        user.role === "MEMBER"
    ) {
        filter.assignedTo =
            user._id;
    }


    /*
    ADMIN FILTER
  
    Admin can filter
    by assigned member
    */

    if (
        user.role === "ADMIN" &&
        assignedTo
    ) {

        if (
            !mongoose.Types.ObjectId.isValid(
                assignedTo
            )
        ) {
            const error =
                new Error(
                    "Invalid assignedTo ID"
                );

            error.statusCode = 400;

            throw error;
        }

        filter.assignedTo =
            assignedTo;
    }


    /*
    STATUS FILTER
    */

    if (status) {
        filter.status =
            status;
    }

    /*
    SEARCH
    */

    if (search && search.trim()) {

        const searchTerm =
            search
                .trim()
                .replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );

        filter.$or = [

            {
                name: {
                    $regex: `^${searchTerm}`,
                    $options: "i",
                },
            },

            {
                email: {
                    $regex: `^${searchTerm}`,
                    $options: "i",
                },
            },

            {
                company: {
                    $regex: `^${searchTerm}`,
                    $options: "i",
                },
            },

        ];
    }

    /*
    DATABASE QUERY
    */

    const [
        leads,
        total,
    ] = await Promise.all([

        Lead.find(filter)

            .populate(
                "assignedTo",
                "name email role"
            )

            .sort({
                createdAt: -1,
            })

            .skip(skip)

            .limit(limit),

        Lead.countDocuments(
            filter
        ),

    ]);


    return {

        leads,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),

            hasNextPage:
                page * limit <
                total,

            hasPreviousPage:
                page > 1,

        },

    };
};


/*
==================================================
GET SINGLE LEAD
==================================================
*/

const getLeadById = async (
    leadId,
    user
) => {

    /*
    Validate MongoDB ID
    */

    if (
        !mongoose.Types.ObjectId.isValid(
            leadId
        )
    ) {

        const error =
            new Error(
                "Invalid lead ID"
            );

        error.statusCode = 400;

        throw error;
    }


    const lead =
        await Lead.findById(
            leadId
        ).populate(
            "assignedTo",
            "name email role"
        );


    /*
    Lead not found
    */

    if (!lead) {

        const error =
            new Error(
                "Lead not found"
            );

        error.statusCode = 404;

        throw error;
    }


    /*
    MEMBER ACCESS CONTROL
  
    Member can only view
    assigned leads
    */

    if (
        user.role === "MEMBER" &&
        (
            !lead.assignedTo ||
            lead.assignedTo._id.toString() !==
            user._id.toString()
        )
    ) {

        const error =
            new Error(
                "You do not have access to this lead"
            );

        error.statusCode = 403;

        throw error;
    }


    return lead;
};


/**
 * Update lead
 */
const updateLead = async (
    leadId,
    updateData,
    user
) => {

    // Get lead and verify access
    const lead =
        await getLeadById(
            leadId,
            user
        );


    /*
    Only these fields can be updated.
  
    This prevents users from changing
    unexpected fields directly.
    */

    const allowedFields = [
        "name",
        "email",
        "phone",
        "company",
        "status",
        "source",
    ];


    const safeUpdate = {};


    /*
    Copy only allowed fields
    */

    allowedFields.forEach(
        (field) => {

            if (
                updateData[field] !==
                undefined
            ) {

                safeUpdate[field] =
                    updateData[field];

            }

        }
    );


    /*
    Store old status
    so we can create activity
    */

    const oldStatus =
        lead.status;


    /*
    Update only safe fields
    */

    Object.assign(
        lead,
        safeUpdate
    );


    /*
    Save updated lead
    */

    await lead.save();


    /*
    Create activity when
    status changes
    */

    if (
        safeUpdate.status &&
        safeUpdate.status !==
        oldStatus
    ) {

        await createActivity({

            type:
                "STATUS_CHANGED",

            description:
                `Status changed from ${oldStatus} to ${safeUpdate.status}`,

            metadata: {

                oldStatus,

                newStatus:
                    safeUpdate.status,

            },

            lead:
                lead._id,

            createdBy:
                user._id,

        });

    }


    return lead;
};

/*
==================================================
ASSIGN LEAD
ADMIN ONLY
==================================================
*/

const assignLead = async (
    leadId,
    assignedTo,
    user
) => {

    /*
    ADMIN CHECK
    */

    if (
        user.role !== "ADMIN"
    ) {

        const error =
            new Error(
                "Only admins can assign leads"
            );

        error.statusCode = 403;

        throw error;
    }


    /*
    VALIDATE LEAD ID
    */

    if (
        !mongoose.Types.ObjectId.isValid(
            leadId
        )
    ) {

        const error =
            new Error(
                "Invalid lead ID"
            );

        error.statusCode = 400;

        throw error;
    }


    /*
    VALIDATE USER ID
    */

    if (
        !mongoose.Types.ObjectId.isValid(
            assignedTo
        )
    ) {

        const error =
            new Error(
                "Invalid user ID"
            );

        error.statusCode = 400;

        throw error;
    }


    /*
    FIND MEMBER
    */

    const member =
        await User.findOne({

            _id:
                assignedTo,

            role:
                "MEMBER",

        });


    if (!member) {

        const error =
            new Error(
                "Assigned user must be a valid member"
            );

        error.statusCode = 400;

        throw error;
    }


    /*
    FIND LEAD
    */

    const lead =
        await Lead.findById(
            leadId
        );


    if (!lead) {

        const error =
            new Error(
                "Lead not found"
            );

        error.statusCode = 404;

        throw error;
    }


    /*
    ASSIGN
    */

    lead.assignedTo =
        assignedTo;


    await lead.save();


    /*
    ACTIVITY
    */

    await createActivity({

        type:
            "ASSIGNED",

        description:
            `Lead assigned to ${member.name}`,

        metadata: {

            assignedTo:
                member._id,

        },

        lead:
            lead._id,

        createdBy:
            user._id,

    });


    return lead;
};


/*
==================================================
DELETE LEAD
ADMIN ONLY
==================================================
*/

const deleteLead = async (
    leadId
) => {

    /*
    VALIDATE ID
    */

    if (
        !mongoose.Types.ObjectId.isValid(
            leadId
        )
    ) {

        const error =
            new Error(
                "Invalid lead ID"
            );

        error.statusCode = 400;

        throw error;
    }


    const lead =
        await Lead.findByIdAndDelete(
            leadId
        );


    if (!lead) {

        const error =
            new Error(
                "Lead not found"
            );

        error.statusCode = 404;

        throw error;
    }


    return lead;
};


module.exports = {

    createLead,

    getLeads,

    getLeadById,

    updateLead,

    assignLead,

    deleteLead,

};