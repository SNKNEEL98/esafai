import { BulletList } from 'react-content-loader'

const MyBulletList = (props) =>
(
  <BulletList
    speed={2}
    width={1000}
    height={500}
    viewBox="-400 -250 1000 500"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
    <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
    <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
    <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
    <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
    <circle cx="20" cy="20" r="20" />
  </BulletList>
)

export default MyBulletList;
