// Generated from the NeetCode 250 patterns deck slides. Edit the data, not the UI.

export const TOPICS = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Tries",
  "Heap",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1D Dynamic Programming",
  "2D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation"
];

export const PATTERNS = [
  {
    "id": 1,
    "topic": "Arrays & Hashing",
    "name": "Hash Set Lookup",
    "whenToUse": "You need O(1) “have I seen this?” checks: duplicates, membership, runs of numbers.",
    "keyIdea": "Put everything in a set. For runs, only start counting from a number with no predecessor.",
    "complexity": "Time O(n) · Space O(n)",
    "code": "def longest_consecutive(nums):\n    s, best = set(nums), 0\n    for x in s:\n        if x - 1 not in s:  # run start\n            y = x\n            while y + 1 in s:\n                y += 1\n            best = max(best, y - x + 1)\n    return best",
    "problems": [
      "Contains Duplicate",
      "Longest Consecutive Sequence",
      "Valid Sudoku",
      "Unique Email Addresses"
    ]
  },
  {
    "id": 2,
    "topic": "Arrays & Hashing",
    "name": "Complement Hash Map",
    "whenToUse": "Find a pair, or any element whose partner was seen earlier in the scan.",
    "keyIdea": "For each x, look up target − x in a map of value to index, then store x. One pass.",
    "complexity": "Time O(n) · Space O(n)",
    "code": "def two_sum(nums, target):\n    seen = {}  # value -> index\n    for i, x in enumerate(nums):\n        if target - x in seen:\n            return [seen[target - x], i]\n        seen[x] = i",
    "problems": [
      "Two Sum",
      "Isomorphic Strings",
      "Subarray Sum Equals K (see 05)"
    ]
  },
  {
    "id": 3,
    "topic": "Arrays & Hashing",
    "name": "Frequency Counting",
    "whenToUse": "Anagrams, character budgets, majority element, “same multiset” questions.",
    "keyIdea": "Count with Counter or a 26-slot array. Use the count tuple as a dictionary key to group equals.",
    "complexity": "Time O(n·k) · Space O(n·k)",
    "code": "def group_anagrams(strs):\n    groups = defaultdict(list)\n    for s in strs:\n        count = [0] * 26\n        for c in s:\n            count[ord(c) - ord(\"a\")] += 1\n        groups[tuple(count)].append(s)\n    return list(groups.values())",
    "problems": [
      "Valid Anagram",
      "Group Anagrams",
      "Majority Element",
      "Find Words That Can Be Formed by Characters"
    ]
  },
  {
    "id": 4,
    "topic": "Arrays & Hashing",
    "name": "Bucket Sort for Top-K",
    "whenToUse": "Top K by frequency, or values in a small known range where counting beats sorting.",
    "keyIdea": "A frequency never exceeds n, so index buckets by count and sweep from the top. No log factor.",
    "complexity": "Time O(n) · Space O(n)",
    "code": "def top_k_frequent(nums, k):\n    count = Counter(nums)\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for x, c in count.items():\n        buckets[c].append(x)\n    res = []\n    for c in range(len(buckets) - 1, 0, -1):\n        for x in buckets[c]:\n            res.append(x)\n            if len(res) == k: return res",
    "problems": [
      "Top K Frequent Elements",
      "Top K Frequent Words",
      "Sort Colors",
      "Sort an Array"
    ]
  },
  {
    "id": 5,
    "topic": "Arrays & Hashing",
    "name": "Prefix Sum",
    "whenToUse": "Many range-sum queries, or counting subarrays whose sum hits a target.",
    "keyIdea": "Sum(i..j) = prefix[j] − prefix[i−1]. Count earlier prefixes equal to current − k in a map.",
    "complexity": "Time O(n) · Space O(n)",
    "code": "def subarray_sum(nums, k):\n    count = {0: 1}  # prefix -> times seen\n    total = res = 0\n    for x in nums:\n        total += x\n        res += count.get(total - k, 0)\n        count[total] = count.get(total, 0) + 1\n    return res",
    "problems": [
      "Subarray Sum Equals K",
      "Product of Array Except Self",
      "Range Sum Query 2D",
      "Find Pivot Index"
    ]
  },
  {
    "id": 6,
    "topic": "Arrays & Hashing",
    "name": "Hash Design & Encoding",
    "whenToUse": "Design a structure with O(1) operations, or serialise data without ambiguity.",
    "keyIdea": "Length-prefix each string (4#abcd) so delimiters inside the data never break decoding.",
    "complexity": "Time O(total length)",
    "code": "def encode(strs):\n    return \"\".join(f\"{len(s)}#{s}\" for s in strs)\ndef decode(s):\n    res, i = [], 0\n    while i < len(s):\n        j = s.index(\"#\", i)\n        n = int(s[i:j])\n        res.append(s[j + 1 : j + 1 + n])\n        i = j + 1 + n\n    return res",
    "problems": [
      "Encode and Decode Strings",
      "Design HashSet",
      "Design HashMap"
    ]
  },
  {
    "id": 7,
    "topic": "Two Pointers",
    "name": "Opposite-Ends Pointers",
    "whenToUse": "Sorted input, palindromes, or pairs where shrinking from both ends keeps a valid answer.",
    "keyIdea": "Move the pointer that is the bottleneck (shorter bar, too-small sum). A discarded option is never revisited.",
    "complexity": "Time O(n) · Space O(1)",
    "code": "def max_area(h):\n    l, r, best = 0, len(h) - 1, 0\n    while l < r:\n        best = max(best, (r - l) * min(h[l], h[r]))\n        if h[l] < h[r]:\n            l += 1\n        else:\n            r -= 1\n    return best",
    "problems": [
      "Valid Palindrome",
      "Two Sum II",
      "Container With Most Water",
      "Trapping Rain Water"
    ]
  },
  {
    "id": 8,
    "topic": "Two Pointers",
    "name": "Read & Write Pointers",
    "whenToUse": "Remove, dedupe or compact an array in place, keeping order, with O(1) extra space.",
    "keyIdea": "The read pointer scans everything. The write pointer marks the next slot for a kept element.",
    "complexity": "Time O(n) · Space O(1)",
    "code": "def remove_duplicates(nums):\n    w = 1\n    for r in range(1, len(nums)):\n        if nums[r] != nums[r - 1]:\n            nums[w] = nums[r]\n            w += 1\n    return w  # new length",
    "problems": [
      "Remove Duplicates from Sorted Array",
      "Remove Element",
      "Move Zeroes"
    ]
  },
  {
    "id": 9,
    "topic": "Two Pointers",
    "name": "Sort + K-Sum",
    "whenToUse": "Unique triplets or quadruplets that sum to a target.",
    "keyIdea": "Sort, fix one number, run two pointers on the rest. Skip equal neighbours to avoid duplicate answers.",
    "complexity": "Time O(n²) · Space O(1)",
    "code": "def three_sum(nums):\n    nums.sort(); res = []\n    for i, a in enumerate(nums):\n        if i and a == nums[i - 1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = a + nums[l] + nums[r]\n            if s < 0: l += 1\n            elif s > 0: r -= 1\n            else:\n                res.append([a, nums[l], nums[r]]); l += 1\n                while l < r and nums[l] == nums[l-1]: l += 1\n    return res",
    "problems": [
      "3Sum",
      "4Sum",
      "Two Sum II"
    ]
  },
  {
    "id": 10,
    "topic": "Two Pointers",
    "name": "Merge Two Sequences",
    "whenToUse": "Combine or compare two sorted sequences, or check one is a subsequence of another.",
    "keyIdea": "One pointer per sequence. In place, fill from the largest end so unread values are never overwritten.",
    "complexity": "Time O(m + n) · Space O(1)",
    "code": "def merge(nums1, m, nums2, n):\n    i, j, k = m - 1, n - 1, m + n - 1\n    while j >= 0:\n        if i >= 0 and nums1[i] > nums2[j]:\n            nums1[k] = nums1[i]; i -= 1\n        else:\n            nums1[k] = nums2[j]; j -= 1\n        k -= 1",
    "problems": [
      "Merge Sorted Array",
      "Squares of a Sorted Array",
      "Is Subsequence"
    ]
  },
  {
    "id": 11,
    "topic": "Sliding Window",
    "name": "Fixed-Size Window",
    "whenToUse": "The window length k is given: nearby duplicates, anagram of fixed length, k-sized averages.",
    "keyIdea": "Add the entering element, drop the leaving one, update the answer. O(1) per step.",
    "complexity": "Time O(n) · Space O(k)",
    "code": "def contains_nearby_dup(nums, k):\n    window = set()\n    for i, x in enumerate(nums):\n        if x in window: return True\n        window.add(x)\n        if len(window) > k:\n            window.remove(nums[i - k])\n    return False",
    "problems": [
      "Contains Duplicate II",
      "Permutation in String"
    ]
  },
  {
    "id": 12,
    "topic": "Sliding Window",
    "name": "Variable Window: Longest Valid",
    "whenToUse": "Longest substring or subarray that satisfies a constraint such as no repeats or at most k changes.",
    "keyIdea": "Right always advances. Left advances only while the window is invalid. Each index moves once.",
    "complexity": "Time O(n) · Space O(alphabet)",
    "code": "def length_of_longest_substring(s):\n    last, l, best = {}, 0, 0\n    for r, c in enumerate(s):\n        if c in last and last[c] >= l:\n            l = last[c] + 1\n        last[c] = r\n        best = max(best, r - l + 1)\n    return best",
    "problems": [
      "Longest Substring Without Repeating Characters",
      "Longest Repeating Character Replacement",
      "Best Time to Buy and Sell Stock"
    ]
  },
  {
    "id": 13,
    "topic": "Sliding Window",
    "name": "Variable Window: Shortest Cover",
    "whenToUse": "Smallest window that meets a requirement: sum at least target, or covers every needed character.",
    "keyIdea": "Expand until valid, then shrink from the left while it stays valid, recording the minimum each time.",
    "complexity": "Time O(n) · Space O(1)",
    "code": "def min_sub_array_len(target, nums):\n    l = total = 0\n    best = float(\"inf\")\n    for r, x in enumerate(nums):\n        total += x\n        while total >= target:\n            best = min(best, r - l + 1)\n            total -= nums[l]; l += 1\n    return 0 if best == float(\"inf\") else best",
    "problems": [
      "Minimum Window Substring",
      "Minimum Size Subarray Sum"
    ]
  },
  {
    "id": 14,
    "topic": "Sliding Window",
    "name": "Monotonic Deque",
    "whenToUse": "The maximum or minimum of every window of size k.",
    "keyIdea": "Keep indices in a deque with decreasing values. The front is the max. Pop expired indices from the front, smaller ones from the back.",
    "complexity": "Time O(n) · Space O(k)",
    "code": "def max_sliding_window(nums, k):\n    dq, res = deque(), []  # dq holds indices\n    for i, x in enumerate(nums):\n        while dq and nums[dq[-1]] <= x:\n            dq.pop()\n        dq.append(i)\n        if dq[0] <= i - k: dq.popleft()\n        if i >= k - 1: res.append(nums[dq[0]])\n    return res",
    "problems": [
      "Sliding Window Maximum"
    ]
  },
  {
    "id": 15,
    "topic": "Stack",
    "name": "Stack: Matching & Evaluation",
    "whenToUse": "Nested or paired structures, undo operations, evaluating expressions, last-in-first-out processing.",
    "keyIdea": "Push openers and operands. On a closer or operator, pop and match or combine. Valid means the stack ends empty.",
    "complexity": "Time O(n) · Space O(n)",
    "code": "def is_valid(s):\n    pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    stack = []\n    for c in s:\n        if c in pairs:\n            if not stack or stack.pop() != pairs[c]:\n                return False\n        else:\n            stack.append(c)\n    return not stack",
    "problems": [
      "Valid Parentheses",
      "Min Stack",
      "Evaluate Reverse Polish Notation",
      "Baseball Game"
    ]
  },
  {
    "id": 16,
    "topic": "Stack",
    "name": "Monotonic Stack",
    "whenToUse": "Next greater or smaller element, days until warmer, spans, largest rectangle in a histogram.",
    "keyIdea": "Keep a stack of indices with monotonic values. A new element pops everything it resolves, so each index is pushed and popped once.",
    "complexity": "Time O(n) · Space O(n)",
    "code": "def daily_temperatures(t):\n    res, stack = [0] * len(t), []\n    for i, x in enumerate(t):\n        while stack and t[stack[-1]] < x:\n            j = stack.pop()\n            res[j] = i - j\n        stack.append(i)\n    return res",
    "problems": [
      "Daily Temperatures",
      "Next Greater Element I",
      "Car Fleet",
      "Largest Rectangle in Histogram"
    ]
  },
  {
    "id": 17,
    "topic": "Binary Search",
    "name": "Classic Binary Search",
    "whenToUse": "Sorted data, or any monotonic yes/no boundary you can test in O(1).",
    "keyIdea": "Keep the invariant that the target lies in lo..hi. Halve the range and move past mid, never onto it.",
    "complexity": "Time O(log n) · Space O(1)",
    "code": "def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target: return mid\n        if nums[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1",
    "problems": [
      "Binary Search",
      "Search a 2D Matrix",
      "Search Insert Position"
    ]
  },
  {
    "id": 18,
    "topic": "Binary Search",
    "name": "Binary Search on the Answer",
    "whenToUse": "“Minimum X such that it is feasible”, where larger X never makes feasibility worse.",
    "keyIdea": "Search the range of possible answers. Write feasible(x) and find the first x where it is true.",
    "complexity": "Time O(n log range)",
    "code": "def min_eating_speed(piles, h):\n    lo, hi = 1, max(piles)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        hours = sum(-(-p // mid) for p in piles)\n        if hours <= h:\n            hi = mid  # feasible, go lower\n        else:\n            lo = mid + 1\n    return lo",
    "problems": [
      "Koko Eating Bananas",
      "Capacity To Ship Packages Within D Days",
      "Split Array Largest Sum"
    ]
  },
  {
    "id": 19,
    "topic": "Binary Search",
    "name": "Rotated Sorted Array",
    "whenToUse": "A sorted array rotated at an unknown pivot; find the minimum or a target.",
    "keyIdea": "One half is always sorted. Compare mid with hi to see where the pivot is, and discard the other half.",
    "complexity": "Time O(log n) · Space O(1)",
    "code": "def find_min(nums):\n    lo, hi = 0, len(nums) - 1\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if nums[mid] > nums[hi]:\n            lo = mid + 1  # pivot is right\n        else:\n            hi = mid\n    return nums[lo]",
    "problems": [
      "Find Minimum in Rotated Sorted Array",
      "Search in Rotated Sorted Array"
    ]
  },
  {
    "id": 20,
    "topic": "Binary Search",
    "name": "Timeline & Partition Search",
    "whenToUse": "Latest value at or before a timestamp, or a median across two sorted arrays.",
    "keyIdea": "Bisect sorted timestamps. For medians, binary-search the cut in the smaller array so left halves stay ≤ right halves.",
    "complexity": "Time O(log n) per query",
    "code": "class TimeMap:\n    def __init__(self):\n        self.d = defaultdict(list)\n    def set(self, key, value, t):\n        self.d[key].append((t, value))\n    def get(self, key, t):\n        arr = self.d[key]\n        i = bisect.bisect_right(arr, (t, chr(127)))\n        return arr[i - 1][1] if i else \"\"",
    "problems": [
      "Time Based Key-Value Store",
      "Median of Two Sorted Arrays"
    ]
  },
  {
    "id": 21,
    "topic": "Linked List",
    "name": "Reverse a Linked List",
    "whenToUse": "Reverse all or part of a list, or flip pointers in place.",
    "keyIdea": "Walk with prev and cur: save next, point cur back, advance. For a sublist, reverse it then reconnect both ends.",
    "complexity": "Time O(n) · Space O(1)",
    "code": "def reverse_list(head):\n    prev, cur = None, head\n    while cur:\n        nxt = cur.next\n        cur.next = prev\n        prev, cur = cur, nxt\n    return prev",
    "problems": [
      "Reverse Linked List",
      "Reverse Linked List II",
      "Reverse Nodes in k-Group"
    ]
  },
  {
    "id": 22,
    "topic": "Linked List",
    "name": "Fast & Slow Pointers",
    "whenToUse": "Cycle detection, finding the middle, the n-th node from the end, duplicate in an index-as-pointer array.",
    "keyIdea": "Slow moves 1, fast moves 2. They meet if there is a cycle. Fast at the end means slow is at the middle.",
    "complexity": "Time O(n) · Space O(1)",
    "code": "def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False",
    "problems": [
      "Linked List Cycle",
      "Find the Duplicate Number",
      "Remove Nth Node From End of List",
      "Reorder List"
    ]
  },
  {
    "id": 23,
    "topic": "Linked List",
    "name": "Merge with a Dummy Head",
    "whenToUse": "Build a new list from one or more lists, or edit a list where the head might change.",
    "keyIdea": "A dummy node removes head special cases. Append the smaller head each step. For k lists, use a min-heap.",
    "complexity": "Time O(m + n) · Space O(1)",
    "code": "def merge_two(a, b):\n    dummy = tail = ListNode()\n    while a and b:\n        if a.val <= b.val:\n            tail.next, a = a, a.next\n        else:\n            tail.next, b = b, b.next\n        tail = tail.next\n    tail.next = a or b\n    return dummy.next",
    "problems": [
      "Merge Two Sorted Lists",
      "Merge k Sorted Lists",
      "Add Two Numbers"
    ]
  },
  {
    "id": 24,
    "topic": "Linked List",
    "name": "Hash Map + Doubly Linked List",
    "whenToUse": "O(1) caches with eviction order (LRU), or copying a list with random pointers.",
    "keyIdea": "Map key to node for O(1) lookup. A doubly linked list gives O(1) move-to-front and evict-from-tail. OrderedDict does both.",
    "complexity": "Time O(1) per op",
    "code": "class LRUCache:\n    def __init__(self, cap):\n        self.cap, self.d = cap, OrderedDict()\n    def get(self, key):\n        if key not in self.d: return -1\n        self.d.move_to_end(key)\n        return self.d[key]\n    def put(self, key, val):\n        self.d[key] = val; self.d.move_to_end(key)\n        if len(self.d) > self.cap:\n            self.d.popitem(last=False)",
    "problems": [
      "LRU Cache",
      "Copy List With Random Pointer"
    ]
  },
  {
    "id": 25,
    "topic": "Trees",
    "name": "Tree DFS: Bottom-Up Recursion",
    "whenToUse": "Depth, balance, diameter, same tree, subtree: the answer is built from the children.",
    "keyIdea": "Decide what dfs(node) returns, combine left and right, and update a global best on the way up.",
    "complexity": "Time O(n) · Space O(h)",
    "code": "def diameter(root):\n    best = 0\n    def dfs(node):\n        nonlocal best\n        if not node: return 0\n        l, r = dfs(node.left), dfs(node.right)\n        best = max(best, l + r)\n        return 1 + max(l, r)\n    dfs(root)\n    return best",
    "problems": [
      "Invert Binary Tree",
      "Maximum Depth",
      "Diameter",
      "Balanced Binary Tree",
      "Same Tree",
      "Subtree of Another Tree"
    ]
  },
  {
    "id": 26,
    "topic": "Trees",
    "name": "BFS Level Order",
    "whenToUse": "Level-by-level output, right-side view, minimum depth, anything that depends on the level.",
    "keyIdea": "Use a queue. At the start of each level snapshot len(queue) and process exactly that many nodes.",
    "complexity": "Time O(n) · Space O(w)",
    "code": "def level_order(root):\n    res, q = [], deque([root] if root else [])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft(); level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res",
    "problems": [
      "Binary Tree Level Order Traversal",
      "Binary Tree Right Side View"
    ]
  },
  {
    "id": 27,
    "topic": "Trees",
    "name": "BST Property",
    "whenToUse": "Ordered trees: validate, search, insert, delete, k-th smallest, lowest common ancestor.",
    "keyIdea": "Left < node < right. Pass (low, high) bounds down. In-order traversal yields sorted values.",
    "complexity": "Time O(n) · Space O(h)",
    "code": "def is_valid_bst(root, lo=float(\"-inf\"), hi=float(\"inf\")):\n    if not root: return True\n    if not lo < root.val < hi: return False\n    return (is_valid_bst(root.left, lo, root.val) and\n        is_valid_bst(root.right, root.val, hi))",
    "problems": [
      "Validate BST",
      "Kth Smallest Element in a BST",
      "Lowest Common Ancestor of a BST",
      "Insert into a BST",
      "Delete Node in a BST"
    ]
  },
  {
    "id": 28,
    "topic": "Trees",
    "name": "Tree Construction",
    "whenToUse": "Rebuild a tree from traversals, or serialise and deserialise one.",
    "keyIdea": "Preorder gives the root first. Its position in inorder splits left and right. An index map makes each split O(1).",
    "complexity": "Time O(n) · Space O(n)",
    "code": "def build_tree(pre, ino):\n    idx = {v: i for i, v in enumerate(ino)}\n    it = iter(pre)\n    def build(lo, hi):\n        if lo > hi: return None\n        node = TreeNode(next(it))\n        m = idx[node.val]\n        node.left = build(lo, m - 1)\n        node.right = build(m + 1, hi)\n        return node\n    return build(0, len(ino) - 1)",
    "problems": [
      "Construct Binary Tree from Preorder and Inorder",
      "Serialize and Deserialize Binary Tree"
    ]
  },
  {
    "id": 29,
    "topic": "Trees",
    "name": "Path Value DFS",
    "whenToUse": "Best path sums, good nodes, any value that accumulates along a root-to-node path.",
    "keyIdea": "Pass state down (max so far) or return gains up. Clamp negative gains to 0, and count a bend through the node in the global best.",
    "complexity": "Time O(n) · Space O(h)",
    "code": "def max_path_sum(root):\n    best = float(\"-inf\")\n    def gain(node):\n        nonlocal best\n        if not node: return 0\n        l = max(gain(node.left), 0)\n        r = max(gain(node.right), 0)\n        best = max(best, node.val + l + r)\n        return node.val + max(l, r)\n    gain(root)\n    return best",
    "problems": [
      "Binary Tree Maximum Path Sum",
      "Count Good Nodes in Binary Tree"
    ]
  },
  {
    "id": 30,
    "topic": "Tries",
    "name": "Trie (Prefix Tree)",
    "whenToUse": "Prefix search, autocomplete, dictionaries with wildcards, searching many words on a grid.",
    "keyIdea": "Each node maps a character to a child and has an end-of-word flag. A prefix lookup costs O(length).",
    "complexity": "Time O(L) per op",
    "code": "class Trie:\n    def __init__(self):\n        self.kids, self.end = {}, False\n    def insert(self, word):\n        node = self\n        for c in word:\n            node = node.kids.setdefault(c, Trie())\n        node.end = True\n    def starts_with(self, p):\n        node = self\n        for c in p:\n            if c not in node.kids: return None\n            node = node.kids[c]\n        return node",
    "problems": [
      "Implement Trie",
      "Design Add and Search Words Data Structure",
      "Word Search II"
    ]
  },
  {
    "id": 31,
    "topic": "Heap",
    "name": "Top-K with a Heap",
    "whenToUse": "K largest, K smallest, K closest, or a stream where you only need the K-th element.",
    "keyIdea": "A min-heap capped at size K keeps the K largest. Its root is the K-th largest.",
    "complexity": "Time O(n log k) · Space O(k)",
    "code": "def find_kth_largest(nums, k):\n    heap = []\n    for x in nums:\n        heapq.heappush(heap, x)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return heap[0]",
    "problems": [
      "Kth Largest Element in a Stream",
      "Kth Largest Element in an Array",
      "K Closest Points to Origin",
      "Last Stone Weight"
    ]
  },
  {
    "id": 32,
    "topic": "Heap",
    "name": "Two Heaps",
    "whenToUse": "Running median, or any problem that splits data into a small half and a large half.",
    "keyIdea": "Max-heap for the lower half, min-heap for the upper half. Keep sizes within 1. The median sits at the tops.",
    "complexity": "Add O(log n) · Median O(1)",
    "code": "class MedianFinder:\n    def __init__(self):\n        self.lo, self.hi = [], []  # max, min\n    def add_num(self, x):\n        heapq.heappush(self.lo, -x)\n        heapq.heappush(self.hi, -heapq.heappop(self.lo))\n        if len(self.hi) > len(self.lo):\n            heapq.heappush(self.lo, -heapq.heappop(self.hi))\n    def find_median(self):\n        if len(self.lo) > len(self.hi): return -self.lo[0]\n        return (-self.lo[0] + self.hi[0]) / 2",
    "problems": [
      "Find Median from Data Stream"
    ]
  },
  {
    "id": 33,
    "topic": "Heap",
    "name": "Heap + Greedy Scheduling",
    "whenToUse": "Always pick the most frequent, earliest or cheapest next item, with cooldowns or spacing rules.",
    "keyIdea": "Max-heap of remaining counts. Take the best each tick, park it in a cooldown queue, return it when ready.",
    "complexity": "Time O(n log k)",
    "code": "def least_interval(tasks, n):\n    heap = [-c for c in Counter(tasks).values()]\n    heapq.heapify(heap)\n    time, cool = 0, deque()  # (ready, count)\n    while heap or cool:\n        time += 1\n        if heap:\n            c = heapq.heappop(heap) + 1\n            if c: cool.append((time + n, c))\n        if cool and cool[0][0] == time:\n            heapq.heappush(heap, cool.popleft()[1])\n    return time",
    "problems": [
      "Task Scheduler",
      "Reorganize String",
      "Design Twitter"
    ]
  },
  {
    "id": 34,
    "topic": "Backtracking",
    "name": "Subsets: Include or Exclude",
    "whenToUse": "Generate all subsets or combinations, or find ones that sum to a target.",
    "keyIdea": "At each index choose it or skip it. For duplicates, sort and skip equal siblings. For reuse, recurse on the same index.",
    "complexity": "Time O(n · 2ⁿ)",
    "code": "def subsets(nums):\n    res, cur = [], []\n    def dfs(i):\n        if i == len(nums):\n            res.append(cur[:]); return\n        cur.append(nums[i]); dfs(i + 1)  # take\n        cur.pop(); dfs(i + 1)  # skip\n    dfs(0)\n    return res",
    "problems": [
      "Subsets",
      "Subsets II",
      "Combination Sum",
      "Combination Sum II"
    ]
  },
  {
    "id": 35,
    "topic": "Backtracking",
    "name": "Permutations: Choice per Slot",
    "whenToUse": "Orderings, or strings built by choosing one option for each position.",
    "keyIdea": "Loop over unused choices, mark used, recurse, unmark. The path length is fixed, so the base case is len == n.",
    "complexity": "Time O(n · n!)",
    "code": "def permute(nums):\n    res, cur = [], []\n    used = [False] * len(nums)\n    def dfs():\n        if len(cur) == len(nums):\n            res.append(cur[:]); return\n        for i, x in enumerate(nums):\n            if used[i]: continue\n            used[i] = True; cur.append(x)\n            dfs()\n            used[i] = False; cur.pop()\n    dfs()\n    return res",
    "problems": [
      "Permutations",
      "Letter Combinations of a Phone Number",
      "Generate Parentheses"
    ]
  },
  {
    "id": 36,
    "topic": "Backtracking",
    "name": "Grid & Board Backtracking",
    "whenToUse": "Find a path on a grid without reusing cells, or place pieces under constraints (N-Queens).",
    "keyIdea": "Mark the cell, try four neighbours, unmark on return. For N-Queens track used columns and diagonals in sets.",
    "complexity": "Time O(R·C·4ᴸ)",
    "code": "def exist(board, word):\n    R, C = len(board), len(board[0])\n    def dfs(r, c, i):\n        if i == len(word): return True\n        if not (0<=r<R and 0<=c<C) or board[r][c]!=word[i]:\n            return False\n        ch, board[r][c] = board[r][c], \"#\"\n        dirs = ((1,0), (-1,0), (0,1), (0,-1))\n        ok = any(dfs(r+a, c+b, i+1) for a, b in dirs)\n        board[r][c] = ch\n        return ok\n    return any(dfs(i // C, i % C, 0) for i in range(R * C))",
    "problems": [
      "Word Search",
      "N-Queens"
    ]
  },
  {
    "id": 37,
    "topic": "Backtracking",
    "name": "Partition Backtracking",
    "whenToUse": "Split a string or array into valid pieces, or assign items to buckets.",
    "keyIdea": "From index i try every end j. Recurse only when s[i:j] is valid. Sort and prune early for bucket problems.",
    "complexity": "Time O(n · 2ⁿ)",
    "code": "def partition(s):\n    res, cur = [], []\n    def dfs(i):\n        if i == len(s):\n            res.append(cur[:]); return\n        for j in range(i + 1, len(s) + 1):\n            piece = s[i:j]\n            if piece == piece[::-1]:\n                cur.append(piece); dfs(j); cur.pop()\n    dfs(0)\n    return res",
    "problems": [
      "Palindrome Partitioning",
      "Partition to K Equal Sum Subsets",
      "Matchsticks to Square"
    ]
  },
  {
    "id": 38,
    "topic": "Graphs",
    "name": "Grid DFS (Flood Fill)",
    "whenToUse": "Connected regions on a grid: islands, area, enclosed regions, water flow.",
    "keyIdea": "Sink visited cells while recursing in four directions. Count DFS starts. For border problems, start from the edges.",
    "complexity": "Time O(R·C) · Space O(R·C)",
    "code": "def num_islands(grid):\n    R, C, count = len(grid), len(grid[0]), 0\n    def dfs(r, c):\n        if not (0<=r<R and 0<=c<C) or grid[r][c]!=\"1\": return\n        grid[r][c] = \"0\"\n        for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)):\n            dfs(r + dr, c + dc)\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == \"1\":\n                dfs(r, c); count += 1\n    return count",
    "problems": [
      "Number of Islands",
      "Max Area of Island",
      "Island Perimeter",
      "Surrounded Regions",
      "Pacific Atlantic Water Flow"
    ]
  },
  {
    "id": 39,
    "topic": "Graphs",
    "name": "Multi-Source BFS",
    "whenToUse": "Shortest distance from many sources at once, or anything that spreads in rounds (rot, fire, gates).",
    "keyIdea": "Seed the queue with every source at distance 0, then expand level by level. The first visit is the shortest.",
    "complexity": "Time O(R·C) · Space O(R·C)",
    "code": "def multi_source_bfs(grid, sources):\n    R, C = len(grid), len(grid[0])\n    dist = {s: 0 for s in sources}\n    q = deque(sources)\n    while q:\n        r, c = q.popleft()\n        for x, y in ((r+1,c), (r-1,c), (r,c+1), (r,c-1)):\n            if 0<=x<R and 0<=y<C and (x, y) not in dist:\n                dist[(x, y)] = dist[(r, c)] + 1\n                q.append((x, y))\n    return dist",
    "problems": [
      "Rotting Oranges",
      "Walls and Gates",
      "Shortest Path in Binary Matrix"
    ]
  },
  {
    "id": 40,
    "topic": "Graphs",
    "name": "Topological Sort",
    "whenToUse": "Prerequisites, build order, derived orderings, or detecting a cycle in a directed graph.",
    "keyIdea": "Kahn’s algorithm: start from in-degree 0, pop, decrement neighbours. If fewer than n nodes come out, there is a cycle.",
    "complexity": "Time O(V + E)",
    "code": "def find_order(n, prereqs):\n    adj, indeg = [[] for _ in range(n)], [0] * n\n    for a, b in prereqs:\n        adj[b].append(a); indeg[a] += 1\n    q = deque(i for i in range(n) if indeg[i] == 0)\n    order = []\n    while q:\n        u = q.popleft(); order.append(u)\n        for v in adj[u]:\n            indeg[v] -= 1\n            if indeg[v] == 0: q.append(v)\n    return order if len(order) == n else []",
    "problems": [
      "Course Schedule",
      "Course Schedule II",
      "Alien Dictionary"
    ]
  },
  {
    "id": 41,
    "topic": "Graphs",
    "name": "Union-Find",
    "whenToUse": "Dynamic connectivity, grouping, counting components, spotting the edge that closes a cycle.",
    "keyIdea": "Find with path compression, union by size. If both endpoints share a root, that edge is redundant.",
    "complexity": "Time ≈ O(α(n)) per op",
    "code": "class DSU:\n    def __init__(self, n):\n        self.p, self.sz = list(range(n)), [1] * n\n    def find(self, x):\n        while self.p[x] != x:\n            self.p[x] = self.p[self.p[x]]\n            x = self.p[x]\n        return x\n    def union(self, a, b):\n        a, b = self.find(a), self.find(b)\n        if a == b: return False  # cycle\n        if self.sz[a] < self.sz[b]: a, b = b, a\n        self.p[b] = a; self.sz[a] += self.sz[b]; return True",
    "problems": [
      "Redundant Connection",
      "Number of Connected Components",
      "Graph Valid Tree"
    ]
  },
  {
    "id": 42,
    "topic": "Graphs",
    "name": "Implicit-Graph BFS",
    "whenToUse": "States are the nodes (words, lock codes) and you need the fewest transformations. Also graph cloning.",
    "keyIdea": "BFS over states, generating neighbours on the fly. A visited set stops loops. To clone, map old node to new node.",
    "complexity": "Time O(N · L · 26)",
    "code": "def ladder_length(begin, end, words):\n    words, q = set(words), deque([(begin, 1)])\n    while q:\n        w, d = q.popleft()\n        if w == end: return d\n        for i in range(len(w)):\n            for ch in \"abcdefghijklmnopqrstuvwxyz\":\n                nxt = w[:i] + ch + w[i+1:]\n                if nxt in words:\n                    words.remove(nxt); q.append((nxt, d + 1))\n    return 0",
    "problems": [
      "Word Ladder",
      "Clone Graph"
    ]
  },
  {
    "id": 43,
    "topic": "Advanced Graphs",
    "name": "Dijkstra",
    "whenToUse": "Shortest path with non-negative weights, or minimising the worst edge along a path.",
    "keyIdea": "Min-heap of (distance, node). Skip stale pops, finalise on first pop, relax neighbours. For “min effort” push max(cur, edge).",
    "complexity": "Time O(E log V)",
    "code": "def network_delay(times, n, k):\n    adj = defaultdict(list)\n    for u, v, w in times: adj[u].append((v, w))\n    dist, heap = {}, [(0, k)]\n    while heap:\n        d, u = heapq.heappop(heap)\n        if u in dist: continue\n        dist[u] = d\n        for v, w in adj[u]:\n            heapq.heappush(heap, (d + w, v))\n    return max(dist.values()) if len(dist) == n else -1",
    "problems": [
      "Network Delay Time",
      "Path With Minimum Effort",
      "Swim in Rising Water"
    ]
  },
  {
    "id": 44,
    "topic": "Advanced Graphs",
    "name": "Bellman-Ford (At Most K Edges)",
    "whenToUse": "Negative edges, or a cap on the number of edges or stops in the path.",
    "keyIdea": "Relax every edge k+1 times, always reading from a copy of the previous round so a path never gains an extra hop.",
    "complexity": "Time O(k · E)",
    "code": "def find_cheapest(n, flights, src, dst, k):\n    dist = [float(\"inf\")] * n\n    dist[src] = 0\n    for _ in range(k + 1):\n        nxt = dist[:]\n        for u, v, w in flights:\n            if dist[u] + w < nxt[v]:\n                nxt[v] = dist[u] + w\n        dist = nxt\n    return -1 if dist[dst] == float(\"inf\") else dist[dst]",
    "problems": [
      "Cheapest Flights Within K Stops"
    ]
  },
  {
    "id": 45,
    "topic": "Advanced Graphs",
    "name": "Minimum Spanning Tree",
    "whenToUse": "Connect every node at minimum total cost.",
    "keyIdea": "Prim: grow one tree, always taking the cheapest edge that leaves it. Kruskal: sort edges and add each one that union-find accepts.",
    "complexity": "Time O(E log V)",
    "code": "def min_cost_connect(points):\n    n, seen, heap, cost = len(points), set(), [(0, 0)], 0\n    while len(seen) < n:\n        d, i = heapq.heappop(heap)\n        if i in seen: continue\n        seen.add(i); cost += d\n        xi, yi = points[i]\n        for j in range(n):\n            if j not in seen:\n                xj, yj = points[j]\n                heapq.heappush(heap, (abs(xi-xj) + abs(yi-yj), j))\n    return cost",
    "problems": [
      "Min Cost to Connect All Points",
      "Reconstruct Itinerary (related: Eulerian path)"
    ]
  },
  {
    "id": 46,
    "topic": "1D Dynamic Programming",
    "name": "Linear DP",
    "whenToUse": "Choices along a line where dp[i] depends on a few earlier states: stairs, rob or skip, decode, break words.",
    "keyIdea": "Define dp[i], write the recurrence, then keep only the last one or two values for O(1) space.",
    "complexity": "Time O(n) · Space O(1)",
    "code": "def rob(nums):\n    prev = cur = 0\n    for x in nums:\n        prev, cur = cur, max(cur, prev + x)\n    return cur\ndef climb_stairs(n):\n    a = b = 1\n    for _ in range(n - 1):\n        a, b = b, a + b\n    return b",
    "problems": [
      "Climbing Stairs",
      "Min Cost Climbing Stairs",
      "House Robber (I, II)",
      "Decode Ways",
      "Word Break",
      "Longest Increasing Subsequence"
    ]
  },
  {
    "id": 47,
    "topic": "1D Dynamic Programming",
    "name": "Unbounded Knapsack",
    "whenToUse": "Unlimited use of each item to reach an amount: fewest coins, number of ways, perfect squares.",
    "keyIdea": "dp[a] = best over each item. Iterate amounts upward so an item can be reused. To count ways, loop items on the outside.",
    "complexity": "Time O(amount · items)",
    "code": "def coin_change(coins, amount):\n    dp = [0] + [float(\"inf\")] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], dp[a - c] + 1)\n    return -1 if dp[amount] == float(\"inf\") else dp[amount]",
    "problems": [
      "Coin Change",
      "Coin Change II",
      "Perfect Squares"
    ]
  },
  {
    "id": 48,
    "topic": "1D Dynamic Programming",
    "name": "0/1 Knapsack",
    "whenToUse": "Each item used at most once: subset sum, equal partition, target sum.",
    "keyIdea": "dp[s] means sum s is reachable. Iterate the capacity downward so an item cannot be counted twice.",
    "complexity": "Time O(n · target)",
    "code": "def can_partition(nums):\n    total = sum(nums)\n    if total % 2: return False\n    target = total // 2\n    dp = [True] + [False] * target\n    for x in nums:\n        for s in range(target, x - 1, -1):\n            dp[s] = dp[s] or dp[s - x]\n    return dp[target]",
    "problems": [
      "Partition Equal Subset Sum",
      "Target Sum",
      "Last Stone Weight II"
    ]
  },
  {
    "id": 49,
    "topic": "2D Dynamic Programming",
    "name": "Grid DP",
    "whenToUse": "Count paths or minimise cost through a grid moving right and down.",
    "keyIdea": "dp[r][c] comes from the top and left cells. Roll a single row for O(C) space. If moves go any direction, use memoised DFS.",
    "complexity": "Time O(R·C) · Space O(C)",
    "code": "def unique_paths(m, n):\n    row = [1] * n\n    for _ in range(m - 1):\n        for c in range(1, n):\n            row[c] += row[c - 1]\n    return row[-1]",
    "problems": [
      "Unique Paths",
      "Unique Paths II",
      "Minimum Path Sum",
      "Longest Increasing Path in a Matrix"
    ]
  },
  {
    "id": 50,
    "topic": "2D Dynamic Programming",
    "name": "Two-String DP",
    "whenToUse": "Compare two strings or sequences: longest common subsequence, edit distance, interleaving, matching.",
    "keyIdea": "dp[i][j] covers prefixes a[:i] and b[:j]. On a match, take the diagonal. Otherwise take the best of dropping one side.",
    "complexity": "Time O(m·n) · Space O(m·n)",
    "code": "def lcs(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i-1] == b[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[-1][-1]",
    "problems": [
      "Longest Common Subsequence",
      "Edit Distance",
      "Distinct Subsequences",
      "Interleaving String",
      "Regular Expression Matching"
    ]
  },
  {
    "id": 51,
    "topic": "Greedy",
    "name": "Kadane’s Algorithm",
    "whenToUse": "Best contiguous subarray by sum or product.",
    "keyIdea": "At each x, either extend the running subarray or restart at x. For products track both the max and the min, since a negative flips them.",
    "complexity": "Time O(n) · Space O(1)",
    "code": "def max_subarray(nums):\n    best = cur = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best",
    "problems": [
      "Maximum Subarray",
      "Maximum Product Subarray"
    ]
  },
  {
    "id": 52,
    "topic": "Greedy",
    "name": "Greedy Reach & Feasibility",
    "whenToUse": "A local choice is provably safe: farthest jump, gas surplus, partition labels, grouping cards.",
    "keyIdea": "Track the farthest reach or running surplus. If you fall behind, the answer is false, or restart from the next index.",
    "complexity": "Time O(n) · Space O(1)",
    "code": "def can_jump(nums):\n    reach = 0\n    for i, x in enumerate(nums):\n        if i > reach: return False\n        reach = max(reach, i + x)\n    return True\ndef can_complete(gas, cost):\n    if sum(gas) < sum(cost): return -1\n    start = tank = 0\n    for i in range(len(gas)):\n        tank += gas[i] - cost[i]\n        if tank < 0: start, tank = i + 1, 0\n    return start",
    "problems": [
      "Jump Game",
      "Jump Game II",
      "Gas Station",
      "Hand of Straights",
      "Merge Triplets",
      "Partition Labels",
      "Valid Parenthesis String"
    ]
  },
  {
    "id": 53,
    "topic": "Intervals",
    "name": "Sort & Merge Intervals",
    "whenToUse": "Overlaps, merges, insertions, scheduling, minimum meeting rooms.",
    "keyIdea": "Sort by start, then compare each interval with the last merged end. To count overlaps, use a min-heap of end times.",
    "complexity": "Time O(n log n)",
    "code": "def merge(intervals):\n    intervals.sort()\n    res = [intervals[0]]\n    for s, e in intervals[1:]:\n        if s <= res[-1][1]:\n            res[-1][1] = max(res[-1][1], e)\n        else:\n            res.append([s, e])\n    return res",
    "problems": [
      "Merge Intervals",
      "Insert Interval",
      "Non-overlapping Intervals",
      "Meeting Rooms I and II",
      "Minimum Interval to Include Each Query"
    ]
  },
  {
    "id": 54,
    "topic": "Math & Geometry",
    "name": "Matrix & Math Tricks",
    "whenToUse": "In-place matrix rotation or traversal, digit manipulation, fast exponentiation.",
    "keyIdea": "Rotate 90° clockwise = reverse rows, then transpose. Spiral = shrink four boundaries. pow(x, n) halves n each step.",
    "complexity": "Rotate O(n²) · Pow O(log n)",
    "code": "def rotate(m):\n    m.reverse()  # flip vertically\n    for i in range(len(m)):\n        for j in range(i):\n            m[i][j], m[j][i] = m[j][i], m[i][j]\ndef my_pow(x, n):\n    if n < 0: x, n = 1 / x, -n\n    res = 1\n    while n:\n        if n & 1: res *= x\n        x, n = x * x, n >> 1\n    return res",
    "problems": [
      "Rotate Image",
      "Spiral Matrix",
      "Set Matrix Zeroes",
      "Happy Number",
      "Plus One",
      "Pow(x, n)",
      "Multiply Strings",
      "Detect Squares"
    ]
  },
  {
    "id": 55,
    "topic": "Bit Manipulation",
    "name": "XOR & Bit Tricks",
    "whenToUse": "Pairs cancel out, counting set bits, masks, or arithmetic without the + operator.",
    "keyIdea": "x ^ x = 0 and x ^ 0 = x, so XOR everything. n & (n − 1) clears the lowest set bit. ans[i] = ans[i >> 1] + (i & 1).",
    "complexity": "Time O(n) · Space O(1)",
    "code": "def single_number(nums):\n    res = 0\n    for x in nums: res ^= x\n    return res\ndef count_bits(n):\n    ans = [0] * (n + 1)\n    for i in range(1, n + 1):\n        ans[i] = ans[i >> 1] + (i & 1)\n    return ans",
    "problems": [
      "Single Number",
      "Missing Number",
      "Number of 1 Bits",
      "Counting Bits",
      "Reverse Bits",
      "Sum of Two Integers",
      "Reverse Integer"
    ]
  }
];

export const SIGNALS = [
  {
    "signal": "Sorted array, find a pair or a target",
    "pattern": "Opposite-ends pointers, binary search",
    "cards": [
      7,
      17
    ]
  },
  {
    "signal": "Longest or shortest substring with a rule",
    "pattern": "Variable sliding window",
    "cards": [
      12,
      13
    ]
  },
  {
    "signal": "Next greater or smaller element",
    "pattern": "Monotonic stack",
    "cards": [
      16
    ]
  },
  {
    "signal": "Minimise the max or maximise the min",
    "pattern": "Binary search on the answer",
    "cards": [
      18
    ]
  },
  {
    "signal": "All subsets, permutations, combinations",
    "pattern": "Backtracking",
    "cards": [
      34,
      35,
      36,
      37
    ]
  },
  {
    "signal": "Fewest steps in a grid or word graph",
    "pattern": "BFS",
    "cards": [
      39,
      42
    ]
  },
  {
    "signal": "Prerequisites, ordering, dependencies",
    "pattern": "Topological sort",
    "cards": [
      40
    ]
  },
  {
    "signal": "Connected groups, redundant edge",
    "pattern": "Union-find",
    "cards": [
      41
    ]
  },
  {
    "signal": "K-th largest, top K, running median",
    "pattern": "Heap",
    "cards": [
      31,
      32
    ]
  },
  {
    "signal": "Count ways, min cost, overlapping choices",
    "pattern": "Dynamic programming",
    "cards": [
      46,
      47,
      48,
      49,
      50
    ]
  }
];
