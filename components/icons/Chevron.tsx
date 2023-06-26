const Chevron = ({ ...props }) => {
  return (
    <svg viewBox="0 0 38 38" fill="none" className="h-full w-full" {...props}>
      <rect
        x="19"
        y="0.615234"
        width="26"
        height="5"
        transform="rotate(45 19 0.615234)"
        fill="currentColor"
      />
      <rect
        x="33.8491"
        y="15.4648"
        width="5"
        height="26"
        transform="rotate(45 33.8491 15.4648)"
        fill="currentColor"
      />
    </svg>
  )
}

export default Chevron
