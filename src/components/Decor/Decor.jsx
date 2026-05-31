const imageNames = [
  'Group 31.svg',
  'Group 41.svg',
  'Group 42.svg',
  'Group 43.svg',
  'Group 46.svg',
  'Group 47.svg',
  'Group 48.svg',
  'Group 49.svg',
  'Group 50.svg',
  'Group-44.svg',
  'Group-45.svg'
]

function imageUrl(name) {
  return `${import.meta.env.BASE_URL}img/${encodeURIComponent(name)}`
}

export default function Decor({ variant = 'dashboard' }) {
  const left = imageNames.slice(0, 4)
  const right = imageNames.slice(4, 8)
  const bottom = imageNames.slice(8)

  if (variant === 'login') {
    return (
      <>
        <div className="decor login-decor left">
          {left.slice(0, 2).map((name) => <img key={name} src={imageUrl(name)} alt="" />)}
        </div>
        <div className="decor login-decor right">
          {right.slice(0, 2).map((name) => <img key={name} src={imageUrl(name)} alt="" />)}
        </div>
        <div className="decor login-decor bottom">
          {bottom.map((name) => <img key={name} src={imageUrl(name)} alt="" />)}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="decor side-decor left">
        <div className="stack">
          {left.map((name) => <img key={name} src={imageUrl(name)} alt="" />)}
        </div>
      </div>
      <div className="decor side-decor right">
        <div className="stack">
          {right.map((name) => <img key={name} src={imageUrl(name)} alt="" />)}
        </div>
      </div>
    </>
  )
}
