const Grant = require("../models/Grant");


exports.createGrant = async (req, res) => {
  try {
    // 1. Create grant in database
    const grant = await Grant.create(req.body);
    
    // 2. Send to n8n
    const n8nResponse = await triggerN8N(grant);

    // 3. Handle n8n response
    if (n8nResponse && n8nResponse.isPDF && n8nResponse.pdfData) {
      // Save PDF and all AI data
      const updatedGrant = await saveGrantWithAIResponse(grant, n8nResponse);
      
      return res.status(200).json({
        success: true,
        message: "Grant proposal generated successfully",
        grant: sanitizeGrant(updatedGrant)
      });
    } else if (n8nResponse && !n8nResponse.isPDF) {
      // Save AI data from JSON response
      const updatedGrant = await saveGrantWithAIResponse(grant, n8nResponse);
      
      return res.status(200).json({
        success: true,
        message: "Grant proposal generated successfully",
        grant: sanitizeGrant(updatedGrant)
      });
    } else {
      // No response data, mark as processing
      grant.status = "processing";
      await grant.save();

      return res.status(201).json({
        success: true,
        message: "Grant submitted to AI brain (n8n)",
        grant: sanitizeGrant(grant)
      });
    }
  } catch (err) {
    console.error('❌ Create grant error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// GET all grants
exports.getGrants = async (req, res) => {
  try {
    const grants = await Grant.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: grants.length,
      grants: grants.map(sanitizeGrant)
    });
  } catch (err) {
    
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// GET single grant
exports.getGrantById = async (req, res) => {
  try {
    const grant = await Grant.findById(req.params.id);
    if (!grant) {
      return res.status(404).json({ 
        success: false, 
        message: "Grant not found" 
      });
    }
    res.json({ 
      success: true, 
      grant: sanitizeGrant(grant) 
    });
  } catch (err) {
    console.error('❌ Get grant error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

//update grant
exports.updateGrant = async (req, res) => {
  try {
    const grant = await Grant.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: "completed" },
      { new: true, runValidators: true }
    );
    if (!grant) {
      return res.status(404).json({ 
        success: false, 
        message: "Grant not found" 
      });
    }
    res.json({ 
      success: true, 
      grant: sanitizeGrant(grant) 
    });
  } catch (err) {
    console.error('❌ Update grant error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// DELETE grant
exports.deleteGrant = async (req, res) => {
  try {
    const grant = await Grant.findByIdAndDelete(req.params.id);
    if (!grant) {
      return res.status(404).json({ 
        success: false, 
        message: "Grant not found" 
      });
    }
    res.json({ 
      success: true, 
      message: "Grant deleted successfully" 
    });
  } catch (err) {
    console.error('❌ Delete grant error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// GET PDF for a grant
exports.getGrantPDF = async (req, res) => {
  try {
    const grant = await Grant.findById(req.params.id);
    if (!grant) {
      return res.status(404).json({ 
        success: false, 
        message: "Grant not found" 
      });
    }

    if (!grant.pdfData) {
      return res.status(404).json({ 
        success: false, 
        message: "PDF not found for this grant" 
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${grant.projectName}_Grant_Proposal.pdf"`);
    res.send(grant.pdfData);
  } catch (err) {
    console.error('❌ Get PDF error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};