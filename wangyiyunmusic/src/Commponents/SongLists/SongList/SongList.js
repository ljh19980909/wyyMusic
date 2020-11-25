import React, { Component } from 'react';
import './SongList.css';
import Store from '../../ReactRedux/Store/Store';
import { songs } from '../../ReactRedux/Actions/Actions';
import Network from '../../Fetch/network';
import { CSSTransition } from 'react-transition-group';
import {
    CustomerServiceOutlined,
    PlusOutlined,
    HeartOutlined,
    MoreOutlined,
    EditOutlined,
    PlayCircleOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';

export default class SongList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playlist: '',
            creator: '',
            tracks: [],
            a: Store.getState().playmenu_id,
            songs: Store.getState().songs.information.sd,
            isdonghua: true,
        };
    }
    // 回退上一页
    backClick() {
        this.setState({
            isdonghua: true,
        });
        setTimeout(() => {
            this.props.history.go(-1);
        }, 1000);
    }
    //点击播放
    play(v, i) {
        // 存数据
        console.log(v, i);
        Store.dispatch(
            songs({
                songs: this.state.a,
                information: {
                    sn: v.name,
                    sm: v.ar.length > 1 ? v.ar[0].name + '/' + v.ar[1].name : v.ar[0].name,
                    sp: v.al.picUrl,
                    sd: v.id,
                    sType: 'SongList',
                    item: i,
                },
            })
        );
    }
    render() {
        return (
            <CSSTransition in={this.state.isdonghua} classNames={'fade'} timeout={1000}>
                <div className="sc-gPEVay eemvWW fly-appear-done fly-enter-done">
                    {/* 导航栏 */}
                    <div className="sc-fMiknA hHHLHY">
                        <i className="iconfont back" onClick={() => this.backClick()}>
                            <ArrowLeftOutlined />
                        </i>
                        <h1>歌单</h1>
                    </div>
                    {/* 详细信息 */}
                    <div className="sc-EHOje jiwVax">
                        <div>
                            {/* 歌单信息 */}
                            <div className="sc-dVhcbM frQFbs">
                                <div
                                    className="background"
                                    style={{
                                        background:
                                            'url(' +
                                            (this.state.playlist.coverImgUrl || '') +
                                            ')no-repeat 0px 0px / 100% 100%',
                                    }}
                                >
                                    <div className="filter"></div>
                                </div>
                                <div className="img_wrapper">
                                    <div className="decorate"></div>
                                    <img src={this.state.playlist.coverImgUrl} alt="" />
                                    <div className="play_count">
                                        <i className="iconfont play">
                                            <CustomerServiceOutlined />
                                        </i>
                                        <span className="count">
                                            {parseFloat(
                                                this.state.playlist.subscribedCount / 10000
                                            ).toFixed(1)}
                                            万
                                        </span>
                                    </div>
                                </div>
                                <div className="desc_wrapper">
                                    <div className="title">{this.state.playlist.name}</div>
                                    <div className="person">
                                        <div className="avatar">
                                            <img src={this.state.creator.avatarUrl} alt="" />
                                        </div>
                                        <div className="name">{this.state.creator.nickname}</div>
                                    </div>
                                </div>
                            </div>
                            {/* 喜好 */}
                            <div className="sc-eqIVtm beBaYj">
                                <div>
                                    <i className="iconfont">
                                        <EditOutlined />
                                    </i>
                                    评论
                                </div>
                                <div>
                                    <i className="iconfont">
                                        <HeartOutlined />
                                    </i>
                                    点赞
                                </div>
                                <div>
                                    <i className="iconfont">
                                        <PlusOutlined />
                                    </i>
                                    收藏
                                </div>
                                <div>
                                    <i className="iconfont">
                                        <MoreOutlined />
                                    </i>
                                    更多
                                </div>
                            </div>
                            {/* 歌曲播放 */}
                            <div className="sc-fAjcbJ iYUxma">
                                <div className="first_line">
                                    <div className="play_all">
                                        <i className="iconfont autoplay">
                                            <PlayCircleOutlined />
                                        </i>
                                        <span className="all">
                                            播放全部
                                            <span className="sum">
                                                (共{this.state.tracks.length}首)
                                            </span>
                                        </span>
                                    </div>
                                    <div className="add_list">
                                        <i className="iconfont">
                                            <PlusOutlined />
                                        </i>
                                        <span>
                                            收藏({' '}
                                            {parseFloat(
                                                this.state.playlist.subscribedCount / 10000
                                            ).toFixed(1)}
                                            万)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* 歌曲列表 */}
                            <ul className="sc-caSCKo dJMRXb" style={{ background: '#fff' }}>
                                {this.state.tracks.map((v, i) => {
                                    return (
                                        <li key={i} onClick={() => this.play(v, i)}>
                                            <span className="index">{i + 1}</span>
                                            <div className="info">
                                                <span>{v.name}</span>
                                                <span>
                                                    {v.ar[0].name}
                                                    {v.ar.length > 1
                                                        ? '/' + v.ar[1].name
                                                        : ''} - {v.al.name}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        );
    }
    componentDidMount() {
        this.setState({
            isdonghua: false,
        });

        Network.get(`/playlist/detail?id=${Store.getState().playmenu_id}`)
            .then(data => {
                this.setState({
                    playlist: data.playlist,
                    creator: data.playlist.creator,
                    tracks: [...data.playlist.tracks],
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
}
