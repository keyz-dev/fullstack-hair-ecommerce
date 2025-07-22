import { ClipLoader } from 'react-spinners';

const Loader = ({ size = 20, color = '#ffffff' }) => {
  return (
    <ClipLoader
      size={size}
      color={color}
      loading={true}
      aria-label="Loading Spinner"
    />
  );
};

export default Loader;
