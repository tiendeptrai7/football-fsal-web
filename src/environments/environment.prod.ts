export const environment = {
  apis: {
    default: {
      url: 'https://api-novo.fractal.vn',
      apiPrefix: '/api/v1/admin',
    },
    auth: {
      url: 'https://api-novo.fractal.vn',
      apiPrefix: '/api/v1',
    },
  },
  media: {
    url: 'https://api-novo.fractal.vn',
    apiPrefix: '/media',
    publishUrl: 'https://api-novo.fractal.vn/media',
  },
  s3: {
    access_key: 'AKIAT3JGYCEJBU2TZJXX',
    region: 'ap-southeast-1',
    bucket: 'novo-nordisk-dev',
    public_url: 'https://novo-nordisk-dev.s3.ap-southeast-1.amazonaws.com',
    access_secret: '0HWVoi4Znk8ypwotupoe9TXf1iSgQuqNHcDanPGg',
    end_point: 'https://s3.ap-southeast-1.amazonaws.com',
  },
};
