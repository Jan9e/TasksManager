import prisma from "../lib/prisma.js";

export const createTask = async(req, res) => {
    try{
        const { title } = req.body;

        const task = await prisma.Task.create({
            data:{
                title,
                userId: req.user.id,
            },
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getTasks = async(req, res) => {
    try{
        const  { page = 1, limit = 10, completed }= req.query;

        const skip = (page-1) * limit;

        if(completed !== undefined) {
            where.completed = completed === "true";
        }

        const tasks = await prisma.task.findMany({
            where:{
                userId: req.user.id,
            },
            skip: Number(skip),
            take: Number(limit),
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
};

export const updateTask = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, completed } = req.body;

        const task = await prisma.task.findFirst({
            where: { id, userId: req.user.id },
        });
        
        if(!task) return res.status(404).json({ message: "Not found" });

        const updated = await prisma.task.update({
            where:{ id },
            data:{ title, completed },
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try{
        const { id } = req.params;

        await prisma.task.delete({
            where: { id },
        });

        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}