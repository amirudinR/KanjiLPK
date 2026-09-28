/**
 * Strip progres di bawah tab: bar + catatan status.
 *
 * @param {{ percent: number, note: string }} props
 */
function ProgressStrip({ percent, note }) {
  return (
    <div className="progress-strip">
      <div
        className="progress-strip-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Progres hafalan ${percent} persen`}
      >
        <span
          className="progress-strip-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="progress-strip-note">{note}</p>
    </div>
  )
}

export default ProgressStrip
