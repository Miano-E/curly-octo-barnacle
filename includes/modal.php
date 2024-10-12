<div id="form-modal" class="modal" style="display:none;">
    <div class="modal-content">
        <span class="close" onclick="closeForm()">&times;</span>
        <div id="error-message" style="color: red; display: none;"></div>
        
        <h3 id="modal-title">Add New Record</h3>
        <form id="record-form">
            <!-- Form content dynamically inserted here -->
        </form>
        
        <button type="submit" class="button-primary" onclick="submitForm()">Submit</button>
    </div>
</div>