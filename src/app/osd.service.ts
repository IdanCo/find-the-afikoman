import { Injectable } from '@angular/core';
import * as OpenSeadragon from 'openseadragon';
import { Rect, TiledImageOptions } from 'openseadragon';
import { BehaviorSubject } from 'rxjs';
import { delay, take } from 'rxjs/operators';

const OSD_OPTIONS: OpenSeadragon.Options = {
  preload: true,
  showNavigator: false, // image map
  showNavigationControl: false, // zoom, etc.
  maxZoomPixelRatio: 3,
  springStiffness: 24,
  animationTime: 1,
  minZoomImageRatio: 1,
  visibilityRatio: 1, // prevent moving image outside viewport
  // crossOriginPolicy: 'Anonymous', // required for openseadragon-filtering
  gestureSettingsMouse: {
    clickToZoom: false,
    // dblClickToZoom: false,
    flickMomentum: 0
  },
  // preserveImageSizeOnResize: false
};

@Injectable({
  providedIn: 'root'
})
export class OsdService {
  viewer: OpenSeadragon.Viewer;
  isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  initialize(element: HTMLElement) {
    this.viewer = new OpenSeadragon.Viewer({
      element,
      ...OSD_OPTIONS
    });

    this.viewer.addHandler('tile-loaded', () => {
      if (this.isLoaded$.getValue()) return; // prevent duplicates
      this.isLoaded$.next(true);
    });
  }

  loadTile(tiledImage: TiledImageOptions) {
    this.viewer.open(tiledImage);
  }

  addOverlay(element: Element, location: Rect) {
    this.isLoaded$
      .pipe(
        take(1),
        delay(250)
      )
      .toPromise()
      .then(() => {
        this.viewer.addOverlay({
          element,
          location,
          checkResize: false // not sure, might improve visibility
        });
      });
  }

  removeOverlay(element: Element) {
    this.viewer.removeOverlay(element);
  }

  destroy() {
    this.viewer.destroy();
  }
}
