import mongoose from 'mongoose';

const dynamicRecordSchema = new mongoose.Schema({
    workspaceId: { type: String, required: true },
    resource: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

dynamicRecordSchema.index({workspaceId: 1, resource: 1})

export const MockRecord = mongoose.models.MockRecord || mongoose.model('MockRecord', dynamicRecordSchema);