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
  azure: {
    sas_connection_string:
      'BlobEndpoint=https://novonordiskdev.blob.core.windows.net/;QueueEndpoint=https://novonordiskdev.queue.core.windows.net/;FileEndpoint=https://novonordiskdev.file.core.windows.net/;TableEndpoint=https://novonordiskdev.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2033-12-31T17:00:00Z&st=2024-08-23T10:20:48Z&spr=https&sig=0T1TDJyY2sR3XpdgnF8rNqI3Z%2BYqm1l2znkQ2HTNa6Q%3D',
    container_name: 'dev',
    public_url: 'https://novonordiskdev.blob.core.windows.net/dev',
  },
};
