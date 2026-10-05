export function formatRecord(record){
    return {id: record._id, ...record.data}
}