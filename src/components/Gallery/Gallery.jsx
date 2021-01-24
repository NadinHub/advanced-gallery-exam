import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
import InfiniteScroll from 'react-infinite-scroll-component';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      count: 30,
      pageNumber: 1,
      galleryWidth: this.getGalleryWidth()
      // height: window.innerHeight,
      // width: window.innerWidth,
    };
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag) {
    const { count, pageNumber } = this.state
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&&page=${pageNumber}&per_page=${count}&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      method: 'GET',
      url: getImagesUrl,
      baseURL: baseUrl
    })
      .then((res) => res.data)
      .then((res) => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState((prevState) => {
            return { images: [...prevState.images, ...res.photos.photo] }
          });
          // this.setState({ images: this.state.images.concat(res.photos.photo) });
          // this.setState(() => {
          //   return { images: [...this.state.images, ...res.photos.photo] }
          // });
        }
      });
  }

  handleResizeGallery = () => {
    this.setState({
      galleryWidth: this.getGalleryWidth()
    });
  };

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    window.addEventListener('resize', this.handleResizeGallery);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  fetchImages = () => {
    this.setState(
      (state) => {
        return { pageNumber: state.pageNumber + 1 };
      },
      () => this.getImages(this.props.tag)
    );
  };

  render() {
    return (
      <InfiniteScroll
        dataLength={this.state.images.length}
        next={() => this.fetchImages(this.props.tag)}
        hasMore={true}
        loader={<h4> Loading ... </h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="gallery-root">
          {this.state.images.map((image, index) =>
          (<Image
            key={`image-${image.id}-title-${image.title}-index-${index}`}
            image={image}
            galleryWidth={this.state.galleryWidth}
          />)
          )
          }
        </div>
      </InfiniteScroll>
    );
  }
}

export default Gallery;
