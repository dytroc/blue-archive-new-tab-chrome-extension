const baseURL = 'https://forum.nexon.com/api/v1';

const boardIds = {
    1018: { name: '공지사항', color: '#2889f1' },
    1076: { name: '업데이트', color: '#e89b15' },
}

const numberOfWallpapers = 3;

const getAnnouncements = async () => {
    const threads = (await Promise.all(Object.keys(boardIds).map(async boardId => {
        try {
            const res = await fetch(`${baseURL}/board/${boardId}/threads?alias=bluearchive&pageNo=1&paginationType=PAGING&pageSize=4&blockSize=5`);
            const json = await res.json();
            const { threads } = json;

            if (!threads) return [];

            return threads;
        } catch (error) {
            return [];
        }
    }))).flat();
    
    return threads.sort((a, b) => b.createDate - a.createDate).slice(0, 4);
};

document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch(`${baseURL}/user/find/${config.blueArchiveUserId}?alias=bluearchive`);
    const json = await res.json();
    
    const gameInfo = json?.userActivity?.gameInfo
    if (!gameInfo) return;

    document.getElementById('blue-archive-nickname').innerHTML = gameInfo.charactername;
    document.getElementById('blue-archive-level').innerHTML = `레벨 ${gameInfo.characterlevel}`;

    const threads = await getAnnouncements();
    const announcements = document.getElementById('blue-archive-threads');

    threads.forEach(({ title, threadId, boardId }) => {
        const thread = document.createElement('a');

        thread.href = `https://forum.nexon.com/bluearchive/board_view?board=${boardId}&thread=${threadId}`
        thread.innerHTML = title;
        thread.className = 'blue-archive-thread';
        const { name, color } = boardIds[boardId];
        thread.style.setProperty('--headline', `'[${name}] '`);
        thread.style.setProperty('--headline-color', color);

        announcements.appendChild(thread);
    });

    document.getElementById('blue-archive-data').style.setProperty('opacity', 1);
});


window.addEventListener('load', () => {
    // background-image: url('./wallpaper.jpg');
    const backgroundImage = document.getElementById('background-image');
    backgroundImage.style.setProperty('background-image', `url('./wallpapers/${Math.floor(Math.random() * numberOfWallpapers)}.png')`);
    backgroundImage.style.setProperty('opacity', 1);
});

