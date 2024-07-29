export const getBoardData = async (t) => {
    try {
        const board = await t.board('all');
        const lists = await t.lists('all');
        const cards = await t.cards('all');

        return {
            board: {
                id: board.id,
                name: board.name,
                url: board.url,
            },
            lists: lists.map(list => ({
                id: list.id,
                name: list.name,
            })),
            cards: cards.map(card => ({
                id: card.id,
                name: card.name,
                desc: card.desc.slice(0, 1000),
                listId: card.idList,
                labels: card.labels.map(label => ({ name: label.name })),
                due: card.due,
                dateLastActivity: card.dateLastActivity,
                members: card.members.map(member => ({ fullName: member.fullName })),
            }))
        };
    } catch (error) {
        console.error('Error fetching board data:', error);
        throw error;
    }
};