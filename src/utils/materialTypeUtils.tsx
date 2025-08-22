import { Play, Image, Headphones, Lectern} from 'lucide-react';

export type MaterialType = '' | 'VIDEO' | 'IMAGE' | 'AUDIO' | 'ELEARNING';
export const types = ['', 'VIDEO', 'IMAGE', 'AUDIO', 'ELEARNING'];

export const getTypeName = (type: string) => {
  switch (type) {
    case '':
      return 'Tất cả';
    case 'VIDEO':
      return 'Video';
    case 'IMAGE':
      return 'Hình ảnh';
    case 'AUDIO':
      return 'Sách nói';
    case 'ELEARNING':
      return 'Bài giảng';
    default:
      return type;
  }
};

export const getTypeIcon = (type: string, size: string = '5') => {
  switch (type) {
    case 'VIDEO':
      return <Play className={`h-${size} w-${size}`}/>;
    case 'IMAGE':
      return <Image className={`h-${size} w-${size}`}/>;
    case 'AUDIO':
      return <Headphones className={`h-${size} w-${size}`}/>;
    case 'ELEARNING':
      return <Lectern className={`h-${size} w-${size}`}/>;
    default:
      return <></>;
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case '':
      return 'blue';
    case 'VIDEO':
      return 'red';
    case 'IMAGE':
      return 'green';
    case 'AUDIO':
      return 'purple';
    case 'ELEARNING':
      return 'orange';
    default:
      return 'gray';
  }
};