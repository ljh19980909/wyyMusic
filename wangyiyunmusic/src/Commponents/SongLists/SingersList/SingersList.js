import React, { Component } from 'react';
import './SingersList.css';
import { ArrowLeftOutlined, PlusOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Store from '../../ReactRedux/Store/Store';
import { songs } from '../../ReactRedux/Actions/Actions';
import { CSSTransition } from 'react-transition-group';

import Network from '../../Fetch/network';

export default class SingersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artist: {},
            hotSongs: [],
            a: Store.getState().playmenu_id,
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
        Store.dispatch(
            songs({
                songs: this.state.a,
                information: {
                    sn: v.name,
                    sm: v.ar.length > 1 ? v.ar[0].name + '/' + v.ar[1].name : v.ar[0].name,
                    sp: v.al.picUrl,
                    sd: v.id,
                    sType: 'SingersList',
                    item: i,
                },
            })
        );
    }
    componentDidMount() {
        this.setState({
            isdonghua: false,
        });
        Network.get(`/artists?id=${Store.getState().playmenu_id}`)
            .then(data => {
                this.setState({
                    artist: { ...data.artist },
                    hotSongs: [...data.hotSongs],
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    render() {
        return (
            <CSSTransition in={this.state.isdonghua} classNames={'fade'} timeout={1000}>
                <div className="sc-dVhcbM iqMlva ">
                    {/* 导航栏 */}
                    <div className="sc-Rmtcm iVjffZ">
                        <i className="iconfont back" onClick={() => this.backClick()}>
                            <ArrowLeftOutlined />
                        </i>
                        <h1>{this.state.artist.name}</h1>
                    </div>
                    {/* 图片 */}
                    <div
                        className="sc-eqIVtm cewbvU"
                        style={{
                            background:
                                'url(' + (this.state.artist.img1v1Url || '') + ') 0% 0% /cover',
                        }}
                    >
                        <div className="filter"></div>
                    </div>
                    {/* 收藏 */}
                    <div className="sc-fAjcbJ khxJci">
                        <i className="iconfont collect">
                            <PlusOutlined />
                        </i>
                        <span className="text">收藏</span>
                    </div>
                    <div className="sc-gisBJw dfQorN" style={{ top: '276px', zIndex: 1 }}></div>
                    <div className="sc-caSCKo gQujEj"></div>
                    <div className="sc-jDwBTQ dZbZib" style={{ top: '276px', zIndex: 1 }}>
                        <div className="sc-EHOje jiwVax">
                            <div className="sc-jlyJG glnqob">
                                {/* 头部播放 */}
                                <div className="first_line">
                                    <div className="play_all">
                                        <i className="iconfont autoplay">
                                            <PlayCircleOutlined />
                                        </i>
                                        <span className="all">
                                            播放全部{' '}
                                            <span className="sum">
                                                (共{this.state.hotSongs.length}首)
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                {/* 歌曲展示 */}
                                <ul className="sc-gipzik heSMxl">
                                    {this.state.hotSongs.map((v, i) => {
                                        return (
                                            <li key={i} onClick={() => this.play(v, i)}>
                                                <span className="index">{i + 1}</span>
                                                <div className="info">
                                                    <span>{v.name}</span>
                                                    <span>
                                                        {v.ar.length > 1
                                                            ? v.ar[0].name + '/' + v.ar[1].name
                                                            : v.ar[0].name}
                                                        -{v.al.name}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* <AudioBottom name="singer" /> */}
                </div>
            </CSSTransition>
        );
    }
}
