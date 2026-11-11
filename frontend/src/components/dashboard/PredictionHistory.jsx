import { History, Trash2, Clock } from "lucide-react";

function PredictionHistory({
  history,
  onClearHistory,
}) {
  if (!history || history.length === 0) {
    return (
      <div className="card prediction-history-card">

        <div className="prediction-history-header">

          <div>
            <p className="card-label">
              AI MEMORY
            </p>

            <h2>
              Prediction History
            </h2>
          </div>

          <History size={22} />

        </div>


        <div className="history-empty">

          <History size={35} />

          <p>
            No prediction history yet.
          </p>

          <span>
            Run an AI prediction to save it here.
          </span>

        </div>

      </div>
    );
  }


  return (
    <div className="card prediction-history-card">

      <div className="prediction-history-header">

        <div>

          <p className="card-label">
            AI MEMORY
          </p>

          <h2>
            Prediction History
          </h2>

        </div>


        <button
          className="clear-history-btn"
          onClick={onClearHistory}
          title="Clear prediction history"
        >

          <Trash2 size={16} />

          CLEAR

        </button>

      </div>


      <div className="history-list">

        {history.map((prediction) => (

          <div
            className="history-item"
            key={prediction.id}
          >

            <div className="history-main">

              <div className="history-icon">
                🏎️
              </div>


              <div className="history-details">

                <strong>
                  {prediction.circuit}
                </strong>


                <span>
                  {prediction.condition}
                </span>

              </div>

            </div>


            <div className="history-result">

              <span className="history-winner">
                🏆 {prediction.winner}
              </span>

              <span className="history-confidence">
                {prediction.confidence}% Confidence
              </span>

            </div>


            <div className="history-time">

              <Clock size={13} />

              {prediction.time}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default PredictionHistory;