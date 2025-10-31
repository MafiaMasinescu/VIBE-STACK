import Note from "../moodels/Note.js";

export async function getAllNotes (_, res) {
    try {
        const notes = (await Note.find().sort({ createdAt: -1 })); // newest first
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes");
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getNoteById(req,res) {
    try {
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message:"note not found"});
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById");
        res.status(500).json({ message: "Internal server error" });
    }       
}

export async function createNote(req, res) {
    try {
        const {title,content} = req.body;
        const note = new Note({title,content});

        const SavedNote = await note.save();
        res.status(201).json({ SavedNote});
    } catch (error) {
        console.error("Error in createNote");
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateNote(req, res) {
    try {
        const {title,content} = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {title,content},
            {
                new:true,
            }
        );
        
        if(!updatedNote) return res.status(404).json({message:"note not found"});
        
        res.status(200).json({message:"Note updated successfully"});
    } catch (error) {
        console.error("Error in updateNote");
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteNote(req, res)  { 
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if(!deletedNote) return res.status(404).json({message:"note not found to delete"});
        res.status(200).json({message: "Note deleted successfully"});
    } catch (error) {
        console.error("Error in deleteNote");
        res.status(500).json({ message: "Internal server error" });
    }
}
