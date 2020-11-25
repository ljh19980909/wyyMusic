import { ADD_PLAYMENU_ID, ADD_PLAYINGLIST } from '../Actions/Actions';

let initstate = {
    playmenu_id: '',
    songs: {
        songs: '',
        information: {
            sn: '',
            sm: '',
            sp: '',
            sd: '',
            sType: '',
            item: '',
        },
    },
    Random: '',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initstate, action) {
    switch (action.type) {
        // 更新歌单
        case ADD_PLAYMENU_ID:
            return {
                playmenu_id: action.payload,
                songs: state.songs,
            };
        // 更新列表
        case ADD_PLAYINGLIST:
            return {
                playmenu_id: state.playmenu_id,
                songs: { ...action.payloads },
                Random: JSON.parse(JSON.stringify(action.payloads.songs)),
            };
        default: {
            return state;
        }
    }
}
