import { useSelectedItemsStore } from '../store/selectedItemsStore';
import './Flyout.css';

interface FlyoutProps {
  onDownload: () => void;
}

function Flyout({ onDownload }: FlyoutProps) {
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const unselectAll = useSelectedItemsStore((state) => state.unselectAll);
  const count = Object.keys(selectedItems).length;

  if (count === 0) {
    return null;
  }

  return (
    <div className="flyout-container" id="selected-flyout" data-testid="selected-flyout">
      <div className="flyout-content">
        <span className="flyout-info" data-testid="selected-count">
          {count} {count === 1 ? 'item selected' : 'items selected'}
        </span>
        <div className="flyout-actions">
          <button
            className="flyout-btn flyout-btn-secondary"
            onClick={unselectAll}
            id="flyout-unselect"
          >
            Unselect all
          </button>
          <button
            className="flyout-btn flyout-btn-primary"
            onClick={onDownload}
            id="flyout-download"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default Flyout;
