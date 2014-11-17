BSTVisualizer
=============
![Unbalanced Binary Search Tree Sample](https://raw.githubusercontent.com/jtcho/BSTVisualizer/master/screenshot.png)
A web-app which helps visualize various binary search trees and their operations.
Designed as a tool in particular for UPenn's CIS121 Data Structures course, due to a frustrating proliferation of out-of-date Java applets.
This implementation runs using purely Javascript and CSS (AngularJS, D3, CSS).
To draw 'nice' trees, I have implemented a slightly less efficient version of Reingold/Tilford's 'tidy tree' algorithm. Who would have known that drawing spatially efficient trees would be an NP-complete problem?

Currently Implemented:
  - Unbalanced
  - AVL
  - Left Leaning Red Black (LLRB)
  
Planned:
  - 2/3 Trees
