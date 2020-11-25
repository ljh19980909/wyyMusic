//添加播放列表
export const ADD_PLAYINGLIST = 'ADD_PLAYINGLIST';
//删除播放列表
export const DEL_PLAYINGLIST = 'DEL_PLAYINGLIST';
//添加更新歌单
export const ADD_PLAYMENU_ID = 'ADD_PLAYMENU_ID';
// 每次点击切换
export function add(id) {
    return {
        type: ADD_PLAYMENU_ID,
        payload: id,
    };
}
// 每次播放歌曲
export function songs(ids) {
    return {
        type: ADD_PLAYINGLIST,
        payloads: ids,
    };
}
