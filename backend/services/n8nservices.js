const axios = require("axios");

const triggerN8N = async (grantData) => {
  try {

    
    const payload = {
      grantId: grantData._id,
      projectName: grantData.projectName,
      description: grantData.description,
      budget: grantData.budget,
      goals: grantData.goals,
      donorType: grantData.donorType,
      organization: grantData.organization,
      location: grantData.location,
      duration: grantData.duration,
      email: grantData.email,
    
      status: grantData.status,
      createdAt: grantData.createdAt
    };

   
    const response = await axios.post(
      process.env.N8N_WEBHOOK_URL,
      payload,
      {
        responseType: 'arraybuffer',
        timeout: 30000 
      }
    );

    const contentType = response.headers['content-type'] || '';
    
    if (contentType.includes('application/pdf')) {
     
      return {
        pdfData: response.data,
        isPDF: true
      };
    } else {
      const jsonString = response.data.toString();
      try {
        const jsonData = JSON.parse(jsonString);
        
        return { ...jsonData, isPDF: false };
      } catch (e) {
        
        return { raw: response.data, isPDF: false };
      }
    }
  } catch (error) {
    console.error("Error triggering n8n:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data.toString());
    }
    throw error;
  }
};

module.exports = triggerN8N;