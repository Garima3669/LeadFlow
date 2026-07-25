import api from "../api/axios";


// Public lead capture
export const createPublicLead =
  async (leadData) => {

    const response =
      await api.post(
        "/leads/public",
        leadData
      );

    return response.data;
  };


// Get leads
export const getLeads =
  async (params = {}) => {

    const response =
      await api.get(
        "/leads",
        {
          params,
        }
      );

    return response.data;
  };


// Get single lead
export const getLeadById =
  async (id) => {

    const response =
      await api.get(
        `/leads/${id}`
      );

    return response.data;
  };


// Update lead
export const updateLead =
  async (
    id,
    data
  ) => {

    const response =
      await api.patch(
        `/leads/${id}`,
        data
      );

    return response.data;
  };


// Assign lead
export const assignLead =
  async (
    id,
    assignedTo
  ) => {

    const response =
      await api.patch(
        `/leads/${id}/assign`,
        {
          assignedTo,
        }
      );

    return response.data;
  };


// Delete lead
export const deleteLead =
  async (id) => {

    const response =
      await api.delete(
        `/leads/${id}`
      );

    return response.data;
  };