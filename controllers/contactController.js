const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc     Get all contacts
//@route    GET /api/contacts
//@access   Public

const getContacts = asyncHandler(async(req, res) => {
    const contacts = await Contact.find();
    res.status(200).json({contacts});
});

//@desc     Get single contact
//@route    GET /api/contacts/:id
//@access   Public

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if(!contact){
        res.status(404);
        throw new Error('this contact is not found');
    }
    res.status(200).json({contact});
});

//@desc     Create new contact
//@route    POST /api/contacts
//@access   Private

const createContact = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email, phone } = req.body;
    if(!name || !email || !phone){
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide name, email and phone'
        });
    }
    console.log("Done validation check");
    console.log(name, email, phone);
    const contact = await Contact.create({name, email, phone});
    res.status(201).json({contact});
});

//@desc     Update contact
//@route    PUT /api/contacts/:id
//@access   Private

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error('this contact is not found');
    }

    const { name, email, phone } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, {name, email, phone}, {new: true, useFindAndModify:true, runValidators: true});

    res.status(200).json({updatedContact});
});

//@desc     Delete contact
//@route    DELETE /api/contacts/:id
//@access   Private

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error('this contact is not found');
    }
    
    await contact.deleteOne();
    
    res.status(200).json({contact});
});

module.exports = {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact
};