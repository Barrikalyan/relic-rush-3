import React, { useEffect, useState } from 'react';
import './styles/confetti.css';

interface ResultModalProps {
  isVisible: boolean;
  valid: boolean;
  score: number;
  totalRequired: number;
  percentage: number;
  onClose: () => void;
  onRetry: () => void;
  isPerfect: boolean;
}

/**
 * Confetti particle component for celebration animation
 */
function ConfettiParticle({
  delay,
  duration,
}: {
  delay: number;
  duration: number;
}) {
  return (
    <div
      className="confetti-particle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        '--hue': Math.random() * 360,
      } as React.CSSProperties}
    />
  );
}

/**
 * Professional result modal with animations, scoring, and confetti
 */
export default function ResultModal({
  isVisible,
  valid,
  score,
  totalRequired,
  percentage,
  onClose,
  onRetry,
  isPerfect,
}: ResultModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible && isPerfect) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isPerfect]);

  if (!isVisible) return null;

  return (
    <>
      {/* Confetti animation for perfect score */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 40 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={Math.random() * 200}
              duration={2000 + Math.random() * 1000}
            />
          ))}
        </div>
      )}

      {/* Modal overlay */}
      <div className="result-modal-overlay">
        <div
          className={`result-modal ${valid ? 'result-modal-success' : 'result-modal-error'}`}
        >
          {/* Header with icon */}
          <div className="result-modal-header">
            <div
              className={`result-icon ${valid ? 'icon-success' : 'icon-error'}`}
            >
              {valid ? '✓' : '✗'}
            </div>
            <h2 className="result-title">
              {valid ? 'Correct Flowchart!' : 'Incorrect Flow'}
            </h2>
          </div>

          {/* Score display */}
          <div className="result-content">
            <div className="score-section">
              <div className="score-value">{percentage}%</div>
              <div className="score-details">
                Score: {score} / {totalRequired} connections correct
              </div>
            </div>


            {/* Progress bar */}
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: valid ? '#10b981' : '#ef4444',
                }}
              />
            </div>

            {/* Message */}
            <div className="result-message">
              {valid
                ? isPerfect
                  ? '🎉 Perfect! All connections are correct!'
                  : '✓ Good job! You got the main flow right.'
                : `❌ Keep trying! You have ${totalRequired - score} incorrect or missing connections.`}
            </div>
          </div>

          {/* Action buttons */}
          <div className="result-actions">
            <button className="btn btn-retry" onClick={onRetry}>
              🔄 Retry
            </button>
            <button className="btn btn-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface ScoreDisplayProps {
  score: number;
  totalRequired: number;
  percentage: number;
  valid: boolean;
}

/**
 * Compact score display for header or inline use
 */
export function ScoreDisplay({
  score,
  totalRequired,
  percentage,
  valid,
}: ScoreDisplayProps) {
  return (
    <div className="inline-score">
      <div className="score-percentage" style={{
        color: valid ? '#10b981' : '#ef4444',
      }}>
        {percentage}%
      </div>
      <div className="score-text">
        {score}/{totalRequired}
      </div>
    </div>
  );
}
